import { BaseScheduler } from './BaseScheduler';

/** cron 调度服务 */
export class BaseCronScheduler extends BaseScheduler {
  public cron!: string;
  public runOnInit = false;
}
