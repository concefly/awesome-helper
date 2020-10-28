import 'koa';
import { BaseApp } from './BaseApp';
import { validate } from './util';

declare module 'koa' {
  interface DefaultContext {
    validate: typeof validate;
    app: typeof BaseApp;
  }
}
