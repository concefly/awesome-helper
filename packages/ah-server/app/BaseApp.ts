import Koa from 'koa';
import urllib, { RequestOptions } from 'urllib';
import { BaseConfig } from './BaseConfig';
import { BaseCronScheduler } from './BaseCronScheduler';
import { BaseIntervalScheduler } from './BaseIntervalScheduler';
import { BaseLogger } from './BaseLogger';
import { BaseRouter } from './BaseRouter';
import { BaseScheduler } from './BaseScheduler';
import { BaseService } from './BaseService';
import { validate } from './util';
import { CronJob } from 'cron';

export class BaseApp<
  C extends BaseConfig = BaseConfig,
  L extends BaseLogger = BaseLogger,
  R extends BaseRouter = BaseRouter
> extends Koa {
  /** 业务扩展 */
  public config: C = new BaseConfig() as any;
  public logger: L = new BaseLogger() as any;
  public router: R = new BaseRouter() as any;

  // service
  public serviceTypes: typeof BaseService[] = [];
  public service: Map<typeof BaseService, BaseService> = new Map();

  // scheduler
  public schedulerTypes: typeof BaseScheduler[] = [];
  public scheduler: Map<typeof BaseScheduler, BaseScheduler> = new Map();

  public async curl<T>(url: string, opt?: RequestOptions) {
    return urllib.request<T>(url, opt);
  }

  protected async init() {
    // 实例化 service
    this.service = new Map(this.serviceTypes.map(ST => [ST, new ST(this)]));
    this.scheduler = new Map(this.schedulerTypes.map(ST => [ST, new ST(this)]));

    const serviceList = [...this.service.values()];
    this.logger.info(`register service: ${serviceList.map(s => s.name)}`);

    // 扩展 ctx
    Object.assign(this.context, { validate, app: this });

    // 更新 service ctx
    this.use((ctx, next) => {
      serviceList.forEach(s => (s.ctx = ctx));
      return next();
    });

    // 路由
    this.use(this.router.routes());
    this.use(this.router.allowedMethods());

    // 全局错误
    this.on('error', err => {
      this.logger.error(err.message || err);
    });
  }

  protected async startScheduler() {
    const list = [...this.scheduler.values()];
    if (list.length === 0) return;

    const cronList = list.filter(s => s instanceof BaseCronScheduler) as BaseCronScheduler[];
    const intervalList = list.filter(
      s => s instanceof BaseIntervalScheduler
    ) as BaseIntervalScheduler[];

    const schedulerLogger = this.logger.extend('Scheduler');

    // cron
    cronList
      .map(s => {
        return new CronJob(
          s.cron,
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
          s.runOnInit
        );
      })
      .forEach(j => j.start());

    // interval
    intervalList.forEach(s => {
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
    });

    this.logger.info(`start scheduler: ${list.map(s => s.name)}`);
  }

  public async start() {
    this.logger.info(this.config.sequelize());

    await this.init();
    await this.startScheduler();

    const port = this.config.LOCAL_PORT;
    this.listen(port);
    this.logger.info(`app start at localhost:${port}`);
  }
}
