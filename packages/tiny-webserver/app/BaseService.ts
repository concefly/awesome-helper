import { Context } from 'koa';
import { BaseApp } from './BaseApp';

export class BaseService {
  readonly name = this.constructor.name;

  protected readonly config = this.app.config;
  protected readonly logger = this.app.logger.extend(this.name);

  public ctx!: Context;

  constructor(protected readonly app: BaseApp) {}
}
