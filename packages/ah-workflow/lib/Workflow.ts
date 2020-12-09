import { PrettierModule } from './module/prettier';
import { TscModule } from './module/tsc';
import { ModuleCtx } from './ModuleCtx';
import { WorkflowModule } from './WorkflowModule';
import { Logger } from './Logger';
import * as fs from 'fs-extra';
import * as glob from 'glob';
import { JestModule } from './module/jest';
import { EslintModule } from './module/eslint';

export class Workflow {
  protected logger = new Logger(this.constructor.name);

  private moduleTypes: typeof WorkflowModule[] = [
    PrettierModule,
    TscModule,
    JestModule,
    EslintModule,
  ];
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
