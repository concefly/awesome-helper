import { Logger } from './Logger';
import { ModuleCtx } from './ModuleCtx';

export class WorkflowModule {
  constructor(protected readonly ctx: ModuleCtx) {}

  protected logger = new Logger(this.constructor.name);

  async lint() {}
  async fix() {}
  async test() {}
  async build() {}
}
