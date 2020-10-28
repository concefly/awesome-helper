import { CronJob } from 'cron';
import Koa from 'koa';
import Router from 'koa-router';
import urllib, { RequestOptions } from 'urllib';
import { Logger } from './Logger';
import { Scheduler } from './Scheduler';
import { Service } from './Service';
import { IConfig, IContext, IScheduler, IService } from '.';
import { validate } from './util';

declare module '.' {
  interface IApplication extends App {}

  interface IContext {
    validate: typeof validate;
    app: IApplication;
  }
}

export class App extends Koa {
  constructor(readonly config: IConfig) {
    super();
  }

  // 注入 app 扩展
  public service: IService = {};
  public scheduler: IScheduler = {};

  public logger = new Logger();
  public router = new Router<any, IContext>();

  public async curl<T>(url: string, opt?: RequestOptions) {
    return urllib.request<T>(url, opt);
  }

  protected async init() {
    // 扩展 ctx
    Object.assign(this.context, { validate, app: this });

    // 更新 service ctx
    this.use((ctx, next) => {
      Object.values(this.service).forEach(s => (s.ctx = ctx));
      return next();
    });

    // 路由
    this.use(this.router.routes());
    this.use(this.router.allowedMethods());

    // 全局错误
    this.on('error', err => {
      this.logger.error(err.message || err);
    });

    this.logger.info(`service: ${Object.values(this.service).map(s => s.name)}`);
  }

  protected async startService() {
    const list: Service[] = Object.values(this.service);
    await Promise.all(list.map(s => s.init?.()));
  }

  /** 启动定时调度 */
  protected async startScheduler() {
    const list: Scheduler[] = Object.values(this.scheduler);
    if (list.length === 0) return;

    const schedulerLogger = this.logger.extend('Scheduler');
    const startList = list.map(s => {
      if (s.cron) {
        return () => {
          new CronJob(
            s.cron!,
            () => {
              s.ctx = this.createContext({} as any, {} as any);
              s.invoke().catch(e => {
                schedulerLogger.error(`${s.name} error: ${e.message || e}`);
              });
            },
            undefined,
            false,
            undefined,
            undefined,
            true
          ).start();
        };
      } else if (s.interval) {
        return () => {
          const invoke = () => {
            s.ctx = this.createContext({} as any, {} as any);
            s.invoke()
              .then(() => setTimeout(invoke, s.interval))
              .catch(e => {
                schedulerLogger.error(`${s.name} error: ${e.message || e}`);
                setTimeout(invoke, s.interval);
              });
          };

          invoke();
        };
      }
    });

    startList.forEach(s => s?.());

    this.logger.info(`start scheduler: ${list.map(s => s.name)}`);
  }

  public async start() {
    this.logger.info(this.config.sequelize());

    await this.init();
    await this.startService();
    await this.startScheduler();

    const port = this.config.LOCAL_PORT;
    this.listen(port);
    this.logger.info(`app start at localhost:${port}`);
  }
}
