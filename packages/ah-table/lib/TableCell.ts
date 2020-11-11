import * as _ from 'lodash';
import { ITableImplement } from './ITableImplement';

export class TableCell {
  constructor(
    readonly imp: ITableImplement,
    readonly data: any,
    readonly config: {
      width: number;
    }
  ) {}

  public render() {
    const strWidth = this.config.width - 2;
    let str =
      typeof this.data === 'string'
        ? this.data
        : typeof this.data === 'number'
        ? this.data + ''
        : JSON.stringify(this.data) || '-';

    str = str.length > strWidth ? _.truncate(str, { length: strWidth }) : _.padEnd(str, strWidth);

    str = ` ${str} `;

    return str;
  }
}
