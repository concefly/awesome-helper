import * as glob from 'glob';

export class ModuleCtx {
  constructor(readonly srcDir: string, readonly outDir: string, readonly projDir: string) {}

  globSrcDir(pattern: string) {
    return glob.sync(pattern, { cwd: this.srcDir, absolute: true });
  }
}
