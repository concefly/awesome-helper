import { BaseEvent, EventClass } from './BaseEvent';

export class EventBus {
  private handleMap = new Map<
    Function,
    Array<{
      handler: Function;
      once?: boolean;
    }>
  >();

  emit<T extends BaseEvent>(event: T) {
    const handlers = this.handleMap.get(event.constructor) || [];
    const newHandlers = handlers.filter(h => {
      h.handler(event);
      return h.once ? false : true;
    });

    this.handleMap.set(event.constructor, newHandlers);

    return this;
  }

  once<T extends EventClass>(type: T, handler: (event: InstanceType<T>) => void) {
    this.handleMap.set(type, (this.handleMap.get(type) || []).concat({ handler, once: true }));
    return this;
  }

  on<T extends EventClass>(type: T, handler: (event: InstanceType<T>) => void) {
    this.handleMap.set(type, (this.handleMap.get(type) || []).concat({ handler }));
    return this;
  }

  off<T extends EventClass>(type?: T, handler?: Function) {
    // 卸载指定 handler
    if (type && handler) {
      this.handleMap.set(
        type,
        (this.handleMap.get(type) || []).filter(_h => _h.handler !== handler)
      );
      return this;
    }

    // 卸载指定 type 的 handler
    if (type) {
      this.handleMap.delete(type);
      return this;
    }

    // 卸载所有
    this.handleMap.clear();
    return this;
  }
}
