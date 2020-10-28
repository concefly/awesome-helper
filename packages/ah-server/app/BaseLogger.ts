import dayjs from 'dayjs';

export class BaseLogger {
  private name = 'APP';

  setName(name: string) {
    this.name = name;
    return this;
  }

  private ft(level: string, msg: string) {
    const timestamp = dayjs().format('YYYY-MM-DD HH:mm:ss.SSS');
    return `[${timestamp}|${this.name}|${level}] ${msg}`;
  }

  extend(subName: string): BaseLogger {
    const Cls = this.constructor;
    const newName = [this.name, subName].join('.');
    return (new (Cls as any)() as BaseLogger).setName(newName);
  }

  info(msg: string) {
    console.info(this.ft('INFO', msg));
  }

  error(msg: string) {
    console.error(this.ft('ERROR', msg));
  }
}
