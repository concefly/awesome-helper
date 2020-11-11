import { TableBody } from './TableBody';
import { TableHead } from './TableHead';
import { TableTd } from './TableTd';
import { TableTh } from './TableTh';
import { TableTr } from './TableTr';

export type ITableImplement = {
  TableHead: typeof TableHead;
  TableBody: typeof TableBody;
  TableTd: typeof TableTd;
  TableTh: typeof TableTh;
  TableTr: typeof TableTr;
};
