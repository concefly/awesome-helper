import { ITableImplement } from './ITableImplement';
import { TableTr } from './TableTr';

export class TableBody {
  constructor(readonly imp: ITableImplement, readonly trList: TableTr[]) {}

  public render() {
    return this.trList.map(t => t.render()).join('\n');
  }
}
