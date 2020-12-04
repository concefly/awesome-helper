import { PrettierWM } from './module/prettier';
import { TscWM } from './module/tsc';
import { ModuleCtx } from './ModuleCtx';
import { WorkflowModule } from './WorkflowModule';
import { Logger } from './Logger';
import * as fs from 'fs-extra';
import * as glob from 'glob';
import { JestWM } from './module/jest';

export class Workflow {
  protected logger = new Logger(this.constructor.name);

  private moduleTypes: typeof WorkflowModule[] = [PrettierWM, TscWM, JestWM];
  private modules = this.moduleTypes.map(M => new M(new ModuleCtx('src', 'dist', process.cwd())));

  async lint() {
    for (const m of this.modules) {
      await m.lint();
    }
  }

  async fix() {
    for (const m of this.modules) {
      await m.fix();
    }
  }

  async test() {
    for (const m of this.modules) {
      await m.test();
    }
  }

  async build() {
    this.logger.info('clean dist');
    glob.sync('dist/*', { absolute: true, nodir: false }).forEach(dir => {
      fs.removeSync(dir);
    });

    for (const m of this.modules) {
      await m.build();
    }
  }

  async ci() {
    await this.lint();
    await this.test();
  }
}
