import { WorkflowModule } from '../WorkflowModule';
import * as jest from 'jest';
import * as fs from 'fs-extra';

export class JestWM extends WorkflowModule {
  private config = {
    collectCoverage: true,
    coverageReporters: ['json', 'html'],
    coverageDirectory: '<rootDir>/coverage',
    rootDir: process.cwd(),
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    // https://github.com/facebook/jest/issues/6766
    testURL: 'http://localhost/',

    globals: JSON.stringify({
      'ts-jest': {
        diagnostics: false,
      },
    }),

    transform: JSON.stringify({
      '^.+\\.[tj]sx?$': require.resolve('ts-jest'),
    }),

    verbose: true,
  };

  async test() {
    if (!fs.existsSync('__test__') || !fs.existsSync('__tests__')) return;

    this.logger.info(`run jest`);
    const r = await jest.runCLI({ ...this.config, _: [], $0: '' }, [process.cwd()]);
    if (!r.results.success) throw new Error('jest fail');
  }
}
