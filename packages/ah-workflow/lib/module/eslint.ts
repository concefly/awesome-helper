import { WorkflowModule } from '../WorkflowModule';
import * as eslint from 'eslint';

export class EslintModule extends WorkflowModule {
  private baseConfig: eslint.ESLint.Options = {
    globInputPaths: false,
    baseConfig: {
      parser: require.resolve('@typescript-eslint/parser'),
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
      rules: {
        'default-case': 'error',
        'no-else-return': 'error',
        'no-return-await': 'error',
        'no-shadow': 'error',
      },
    },
  };

  async lint() {
    const config = {
      ...this.baseConfig,
    };

    this.logger.info(`run eslint, config=${JSON.stringify(config, null, 2)}`);
    const linter = new eslint.ESLint(config);

    const result = await linter.lintFiles(this.ctx.globSrcDir('**/*.{js,jsx,ts,tsx}'));
    const errorResult = eslint.ESLint.getErrorResults(result);

    if (errorResult.length === 0) return;

    const formatter = await linter.loadFormatter();
    const errorText = formatter.format(errorResult);

    this.logger.info(errorText);

    throw new Error('eslint fail');
  }
}
