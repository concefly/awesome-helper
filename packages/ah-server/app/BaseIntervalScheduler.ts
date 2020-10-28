import { BaseScheduler } from './BaseScheduler';

/** interval 调度服务 */
export class BaseIntervalScheduler extends BaseScheduler {
  public interval!: number;
}
