import { WorkflowModule } from '../WorkflowModule';
import * as prettier from 'prettier';
import * as fs from 'fs';

export class PrettierWM extends WorkflowModule {
  private config: prettier.Options = {
    trailingComma: 'es5',
    tabWidth: 2,
    semi: true,
    singleQuote: true,
    jsxSingleQuote: true,
    printWidth: 100,
    bracketSpacing: true,
    jsxBracketSameLine: false,
    arrowParens: 'avoid',
    parser: 'typescript',
  };

  async lint() {
    const filePaths = this.ctx.globSrcDir('**/*.{ts,tsx,js,jsx}');

    for (const filepath of filePaths) {
      const content = fs.readFileSync(filepath, { encoding: 'utf-8' });

      this.logger.info(`check ${filepath}`);
      const isOk = prettier.check(content, this.config);
      if (!isOk) throw new Error(`prettier check error: ${filepath}`);
    }
  }

  async fix() {
    const filePaths = this.ctx.globSrcDir('**/*.{ts,tsx,js,jsx}');

    for (const filepath of filePaths) {
      const content = fs.readFileSync(filepath, { encoding: 'utf-8' });

      this.logger.info(`format ${filepath}`);
      const formattedContent = prettier.format(content, this.config);

      fs.writeFileSync(filepath, formattedContent, { encoding: 'utf-8' });
    }
  }
}
