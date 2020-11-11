import { ITableColumn } from './ITableColumn';
import { ITableData } from './ITableData';
import { ITableImplement } from './ITableImplement';
import { TableBody } from './TableBody';
import { TableHead } from './TableHead';
import { TableTd } from './TableTd';
import { TableTh } from './TableTh';
import { TableTr } from './TableTr';
import * as _ from 'lodash';

export class Table<T extends ITableData = ITableData> {
  protected imp: ITableImplement = {
    TableHead,
    TableBody,
    TableTd,
    TableTh,
    TableTr,
  };

  protected defaultColumnWidth = 16;

  constructor(readonly columns: ITableColumn[], readonly datasource: T[]) {}

  public getWidth() {
    return _.sum(this.columns.map(c => c.width || this.defaultColumnWidth));
  }

  public render() {
    const headTr = new this.imp.TableTr(
      this.imp,
      this.columns.map(
        c =>
          new this.imp.TableTh(this.imp, c.title || c.dataIndex, {
            width: c.width || this.defaultColumnWidth,
          })
      )
    );
    const head = new this.imp.TableHead(this.imp, headTr);

    const bodyTrList = this.datasource.map(data => {
      return new this.imp.TableTr(
        this.imp,
        this.columns.map(
          c =>
            new this.imp.TableTd(this.imp, _.get(data, c.dataIndex), {
              width: c.width || this.defaultColumnWidth,
            })
        )
      );
    });

    const body = new this.imp.TableBody(this.imp, bodyTrList);
    const gutter = Array(this.getWidth()).fill('-').join('');

    return ['', gutter, head.render(), gutter, body.render(), gutter, ''].join('\n');
  }
}
