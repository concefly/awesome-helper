import 'koa';

export interface IApplication {}
export interface IService {}

export interface IContext {}
export interface IConfig {}

declare module 'koa' {
  interface DefaultContext extends IContext {}
}

export * from './App';
export * from './Config';
export * from './Logger';
export * from './Service';
export * from './util';
export * from './Scheduler';

/** @deprecated 不再使用 */
export interface IScheduler {}
