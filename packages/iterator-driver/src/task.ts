import { EventBus, BaseEvent } from './event';
import { getUUid } from './util';

export class BaseTask<T> {
  iter: IterableIterator<T> = null;
  priority: number = 0;
  eventBus = new EventBus();
  name: string;

  on<T extends typeof BaseEvent>(type: T, h: (event: InstanceType<T>) => void) {
    this.eventBus.on(type, h);
    return this;
  }

  off<T extends typeof BaseEvent>(type?: T, h?: Function) {
    this.eventBus.off(type, h);
    return this;
  }
}

export class SingleTask<T> extends BaseTask<T> {
  constructor(
    readonly iter: IterableIterator<T>,
    public priority: number = 0,
    public readonly name: string = getUUid('SingleTask-')
  ) {
    super();
  }
}

export class SerialTask<T> extends BaseTask<T> {
  constructor(
    private readonly iters: IterableIterator<T>[],
    public priority: number = 0,
    public readonly name: string = getUUid('SerialTask-')
  ) {
    super();

    const self = this;

    this.iter = (function*() {
      for (const iter of self.iters) {
        for (const _ of iter) {
          yield _;
        }
      }
    })();
  }
}
