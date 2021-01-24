import { data2Schema, renderService } from '../src';
import apiJson from './api.json';

describe('util', () => {
  it('renderService', () => {
    const serviceMap = renderService(apiJson as any);
    expect(serviceMap).toMatchSnapshot();
  });

  describe('data2Schema', () => {
    it('normal', () => {
      const s = data2Schema({
        pageSize: 1,
        pageNum: 1,
        total: 783562,
        list: [
          {
            id: 1,
            created_at: '2021-01-24T17:22:45+08:00',
            updated_at: '2021-01-24T17:22:45+08:00',
            level: 0,
            a: '0dfew2',
            b: false,
            c: null,
            d: undefined,
            e: true,
            f: NaN,
          },
        ],
      });

      expect(s).toMatchSnapshot();
    });
  });
});
