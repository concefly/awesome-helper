import { ApiGenerator } from '../src';
import apiJson from './api.json';

describe('ApiGenerator', () => {
  it('normal', () => {
    const api = new ApiGenerator(apiJson as any);
    const tsContent = api.emit2Ts();
    expect(tsContent).toMatchSnapshot();
  });
});
