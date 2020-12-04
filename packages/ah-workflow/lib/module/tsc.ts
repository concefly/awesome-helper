import { WorkflowModule } from '../WorkflowModule';
import { spawnSync } from 'child_process';
import * as fs from 'fs-extra';

export class TscWM extends WorkflowModule {
  private resolveTsConfigPath(stage: string) {
    const configPath = `${this.ctx.projDir}/tsconfig.${stage}.json`;
    if (fs.existsSync(configPath)) return configPath;

    return `${this.ctx.projDir}/tsconfig.json`;
  }

  async lint() {
    this.logger.info(`start tsc lint`);
    spawnSync('tsc', ['-p', 'tsconfig.json', '--noEmit']);
  }

  async build() {
    const cPath = this.resolveTsConfigPath('build');

    this.logger.info(`build (tsc -p ${cPath} --outDir ${this.ctx.outDir})`);
    spawnSync(`tsc`, ['-p', cPath, '--outDir', this.ctx.outDir]);
  }
}
