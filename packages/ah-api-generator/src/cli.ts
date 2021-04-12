#!/usr/bin/env node

import yargs from 'yargs';
import { readFileSync, writeFileSync } from 'fs';
import { ApiGenerator } from './ApiGenerator';

yargs
  .command<{ input: string; template?: string; dist: string }>(
    'emit',
    '导出到文件',
    _yargs => {},
    argv => {
      const { input, template, dist } = argv;

      const apiDocJson = JSON.parse(readFileSync(input, { encoding: 'utf-8' }));
      const g = new ApiGenerator(apiDocJson);

      const tplStr = template ? readFileSync(template, { encoding: 'utf-8' }) : undefined;
      const tsContent = g.emit2Ts(tplStr);

      writeFileSync(dist, tsContent, { encoding: 'utf-8' });
    }
  )
  .option('input', { alias: 'i', describe: '输入 apiDoc 文件', default: 'api.json' })
  .option('template', { alias: 't', describe: '模板文件' })
  .option('dist', { alias: 'd', describe: '导出文件', default: 'service.ts' }).argv;
