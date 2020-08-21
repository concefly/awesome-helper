import {
  EventBus,
  BaseEvent,
  DoneEvent,
  YieldEvent,
  StartEvent,
  PauseEvent,
  ResumeEvent,
  DropEvent,
  EmptyEvent,
  StopEvent,
  CrashEvent,
} from './event';
import { BaseTask } from './task';
import { BaseScheduler } from './scheduler';
import { runtimeMs, toPromise, cond, noop, setInjectValue, getInjectValue } from './util';

export enum DriverStateEnum {
  stop = 'stop',
  running = 'running',
  paused = 'paused',
  error = 'error',
}

export enum TaskStageEnum {
  init = 'init',
  running = 'running',
  error = 'error',
  dropped = 'dropped',
  done = 'done',
}

export type ITaskData<T> = {
  task: T;
  stage: TaskStageEnum;

  /** 运行 ms 数 */
  ms?: number;
  sendValue?: any;
  error?: Error;
};

enum CommandEnum {
  exit = 'exit',
  continue = 'continue',
}

type IInjectCommandItem = { command: CommandEnum; onEnd?(): void };

/** 创建切片任务驱动器 */
export class TaskDriver<T extends BaseTask = BaseTask> {
  protected taskPool = new Map<string, ITaskData<T>>();
  protected eventBus = new EventBus();
  protected state: DriverStateEnum = DriverStateEnum.stop;
  protected injectCommands: IInjectCommandItem[] = [];

  constructor(
    tasks: T[],
    protected readonly scheduler: BaseScheduler,
    protected readonly callback?: (value: T) => void,
    protected readonly config?: {
      /** 添加任务时自动启动 */
      autoStart?: boolean;
      autoOverwrite?: boolean;
    }
  ) {
    // 初始化任务池
    this.taskPool = new Map(
      tasks.map(task => [
        task.name,
        {
          task,
          stage: TaskStageEnum.init,
        } as ITaskData<T>,
      ])
    );
  }

  protected emitAll<E extends BaseEvent>(
    event: E,
    tasks: T[] = [...this.taskPool.values()].map(d => d.task)
  ) {
    // 给自己 emit
    this.eventBus.emit(event);
    // 给 task emit
    for (const task of tasks) {
      task.eventBus.emit(event);
    }
  }

  /** @override 自定义选取 task */
  protected pickTask(tasks: ITaskData<T>[]): T | undefined {
    if (tasks.length === 0) return;

    // 优先级大的排后面
    tasks.sort((a, b) => {
      return (
        // 优先级排序
        a.task.priority - b.task.priority ||
        // 次优先级排序
        a.task.minorPriority - b.task.minorPriority ||
        // 运行时间排序
        (() => {
          const aMs = a.ms || 0;
          const bMs = b.ms || 0;
          // 耗时越长，优先级约低
          return bMs - aMs;
        })()
      );
    });

    return tasks.pop()?.task;
  }

  /** @override 自定义判断任务是否执行 */
  protected shouldTaskRun(_task: T): boolean {
    return true;
  }

  protected pickTaskData(taskDataList: ITaskData<T>[]): ITaskData<T> | undefined {
    taskDataList = taskDataList.filter(t => this.shouldTaskRun(t.task));

    const taskName = this.pickTask(taskDataList)?.name;
    return taskName ? this.taskPool.get(taskName) : undefined;
  }

  /**
   * @override 判断是否要进行此次调度
   */
  protected shouldRunCallLoop(): boolean {
    return true;
  }

  protected getUnFinishTaskPoolItem(): ITaskData<T>[] {
    return [...this.taskPool.values()].filter(d => d.stage === 'init' || d.stage === 'running');
  }

  async start() {
    // float promise
    this.doLoop();

    return this;
  }

  pause() {
    this.state = DriverStateEnum.paused;
    this.emitAll(new PauseEvent());
    return this;
  }

  resume() {
    this.state = DriverStateEnum.running;
    this.emitAll(new ResumeEvent());
    return this;
  }

  async drop(tasks: T[]) {
    const stageHandler = cond<{ taskData: ITaskData<T> }>({
      init: ctx => (ctx.taskData.stage = TaskStageEnum.dropped),
      running: ctx => {
        // 卸载正在执行中的任务，要废弃掉当前这个循环
        return new Promise(resolve => {
          this.injectCommands.unshift({
            command: CommandEnum.continue,
            onEnd: () => {
              ctx.taskData.stage = TaskStageEnum.dropped;
              this.emitAll(new DropEvent([ctx.taskData.task]), [ctx.taskData.task]);
              resolve();
            },
          });
        });
      },
      error: noop,
      dropped: noop,
      done: ctx => {
        ctx.taskData.task.iter.return?.();
      },
    });

    // 结束任务
    for (const { name } of tasks) {
      const taskData = this.taskPool.get(name);
      if (!taskData) return;

      await stageHandler(taskData.stage, { taskData });
    }

    return this;
  }

  async dropAll() {
    const tasks = this.getUnFinishTaskQueue();
    await this.drop(tasks);

    return this;
  }

  /**
   * 停止
   * - 清理各种定时器
   * - 重置状态
   */
  async stop() {
    // 卸掉所有任务
    await this.dropAll();

    // 清除任务池
    this.taskPool.clear();

    if (this.state === DriverStateEnum.running) {
      // 设置退出循环
      await new Promise(resolve => {
        this.injectCommands.unshift({
          command: CommandEnum.exit,
          onEnd: () => {
            this.state = DriverStateEnum.stop;
            this.emitAll(new StopEvent());
            resolve();
          },
        });
      });
    } else if (this.state === DriverStateEnum.stop) {
      // 已经 stop 则什么都不干
    } else {
      this.state = DriverStateEnum.stop;
      this.emitAll(new StopEvent());
    }

    return this;
  }

  /**
   * 销毁
   * - stop & 清空事件监听
   */
  async dispose() {
    await this.stop();
    this.eventBus.off();
    return this;
  }

  addTask(task: T) {
    if (!this.config?.autoOverwrite) {
      if (this.taskPool.has(task.name)) throw new Error('当前任务已存在 ' + task.name);
    }

    this.taskPool.set(task.name, {
      task,
      stage: TaskStageEnum.init,
    });

    if (this.config?.autoStart && this.state !== DriverStateEnum.running) this.start();

    return this;
  }

  /** 获取未完成的任务队列 */
  getUnFinishTaskQueue(): T[] {
    return this.getUnFinishTaskPoolItem().map(d => d.task);
  }

  get isRunning(): boolean {
    return this.state === 'running';
  }

  on<E extends typeof BaseEvent>(type: E, h: (event: InstanceType<E>) => void) {
    this.eventBus.on(type, h);
    return this;
  }

  off<E extends typeof BaseEvent>(type?: E, h?: Function) {
    this.eventBus.off(type, h);
    return this;
  }

  once<E extends typeof BaseEvent>(type: E, h: (event: InstanceType<E>) => void) {
    this.eventBus.once(type, h);
    return this;
  }

  getState(): DriverStateEnum {
    return this.state;
  }

  protected async doLoop() {
    if (this.state === 'running') return;
    this.state = DriverStateEnum.running;

    const waitPromise = async <T>(value: Promise<T>): Promise<T> => {
      const result = await value;

      // 系统注入的异常
      if (this.injectCommands.length) {
        const commandItem = this.injectCommands.pop()!;
        throw setInjectValue(new Error(commandItem.command), commandItem);
      }

      return result;
    };

    const waitSchedule = () =>
      waitPromise(
        new Promise<void>(r => this.scheduler.schedule(r))
      );

    // 开始事件
    this.emitAll(
      new StartEvent(),
      [...this.taskPool.values()].map(d => d.task)
    );

    const exit = (err?: Error) => {
      if (err) {
        this.state = DriverStateEnum.error;
        this.emitAll(new CrashEvent(err));
      } else {
        if (this.state !== DriverStateEnum.stop) {
          this.state = DriverStateEnum.stop;
          this.emitAll(new StopEvent());
        }
      }
    };

    try {
      while (1) {
        try {
          // 每个循环开始都要等待调度
          await waitSchedule();

          const taskInfos = this.getUnFinishTaskPoolItem();
          if (taskInfos.length === 0) {
            this.emitAll(new EmptyEvent(), []);
            break;
          }

          // 判断是否暂停中
          // FIXME: ts 类型系统会误判 state 始终为 running
          if ((this.state as any) === 'paused') continue;

          // 自定义检查
          if (!this.shouldRunCallLoop()) continue;

          const shouldRunTaskInfos = taskInfos.filter(d => this.shouldTaskRun(d.task));
          if (shouldRunTaskInfos.length === 0) continue;

          // 优先级排序
          const taskInfo = this.pickTaskData(shouldRunTaskInfos);
          if (!taskInfo) continue;

          taskInfo.stage = TaskStageEnum.running;
          const { sendValue } = taskInfo;

          // 求值
          let resolvedValue: any;
          let isDone = false;
          let invokeMs = 0;

          try {
            const [{ value, done }, ms] = runtimeMs(() => taskInfo.task.iter.next(sendValue));
            invokeMs = ms;
            isDone = !!done;

            resolvedValue = await waitPromise(toPromise(value));
          } catch (taskError) {
            // 如果是注入的错误，直接往外抛，由外面处理
            if (getInjectValue(taskError)) throw taskError;

            // 否则抛事件，并继续调度
            taskInfo.stage = TaskStageEnum.error;
            taskInfo.error = taskError;

            this.emitAll(new DoneEvent(taskError, undefined, taskInfo.task), [taskInfo.task]);
            continue;
          }

          // 累加运行时间
          taskInfo.ms = (taskInfo.ms || 0) + invokeMs;

          // 记录 sendValue
          taskInfo.sendValue = resolvedValue;

          if (isDone) {
            taskInfo.stage = TaskStageEnum.done;
            this.emitAll(new DoneEvent(null, resolvedValue, taskInfo.task), [taskInfo.task]);
          } else {
            this.callback && this.callback(resolvedValue);
            this.emitAll(new YieldEvent(resolvedValue, taskInfo.task), [taskInfo.task]);
          }
        } catch (commonError) {
          const commandItem = getInjectValue(commonError) as IInjectCommandItem;

          if (commandItem) {
            const { command, onEnd } = commandItem;

            // 退出
            if (command === 'exit') {
              onEnd?.();
              break;
            }

            // 下一个循环
            if (command === 'continue') {
              onEnd?.();
              continue;
            }
          } else {
            throw commonError;
          }
        }
      }

      // 执行退出逻辑
      exit();
    } catch (finalError) {
      exit(finalError);
      throw finalError;
    }
  }
}
