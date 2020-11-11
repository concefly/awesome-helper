import { ITableImplement } from './ITableImplement';
import { TableCell } from './TableCell';

export class TableTr {
  constructor(readonly imp: ITableImplement, readonly cells: TableCell[]) {}

  render() {
    return this.cells.map(c => c.render()).join('|');
  }
}
