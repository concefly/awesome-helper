#!/usr/bin/env node

import { Workflow } from './Workflow';
import * as yargs from 'yargs';

yargs
  .command(
    'test',
    'test',
    _yargs => {},
    _argv => {
      const w = new Workflow();

      w.test().catch(e => {
        console.log('@@@', 'e ->', e);
        process.exit(1);
      });
    }
  )
  .command(
    'ci',
    'ci',
    _yargs => {},
    _argv => {
      const w = new Workflow();

      w.ci().catch(e => {
        console.log('@@@', 'e ->', e);
        process.exit(1);
      });
    }
  )
  .command(
    'fix',
    'fix',
    _yargs => {},
    _argv => {
      const w = new Workflow();

      w.fix().catch(e => {
        console.log('@@@', 'e ->', e);
        process.exit(1);
      });
    }
  )
  .command(
    'build',
    'build',
    _yargs => {},
    _argv => {
      const w = new Workflow();

      w.build().catch(e => {
        console.log('@@@', 'e ->', e);
        process.exit(1);
      });
    }
  ).argv;
