import { ITableImplement } from './ITableImplement';
import { TableTr } from './TableTr';

export class TableHead {
  constructor(readonly ioc: ITableImplement, readonly tr: TableTr) {}

  public render() {
    return this.tr.render();
  }
}
