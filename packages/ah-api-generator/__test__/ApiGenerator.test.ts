import { ApiGenerator } from '../src';
import apiJson from './api.json';

describe('ApiGenerator', () => {
  it('normal', () => {
    const api = new ApiGenerator(apiJson as any);
    const serviceFile = api.emitToString();
    expect(serviceFile).toMatchSnapshot();
  });
});
