export class BaseEvent {}

export type EventClass = {
  new (...args: any[]): BaseEvent;
};
