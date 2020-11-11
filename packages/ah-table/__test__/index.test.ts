import { ITableColumn } from '../lib/ITableColumn';
import { ITableData } from '../lib/ITableData';
import { Table } from '../lib/Table';

const columns: ITableColumn[] = [
  {
    dataIndex: 'id',
    width: 5,
  },
  {
    title: 'fruit title',
    dataIndex: 'fruit',
    width: 30,
  },
  {
    dataIndex: 'date',
  },
  {
    dataIndex: 'foo.bar',
  },
];

const datasource: ITableData[] = [
  { fruit: 'apple', date: '2020-11-11' },
  { fruit: 'banana', foo: { bar: 'xxx' } },
  { fruit: 'long name wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww' },
].map((d, id) => ({ id, ...d }));

describe('Table', () => {
  it('normal', () => {
    const t = new Table(columns, datasource);
    const s = t.render();
    expect(s).toMatchSnapshot();
  });
});
