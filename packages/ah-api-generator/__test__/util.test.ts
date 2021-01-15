import { renderService } from '../src';
import apiJson from './api.json';

describe('util', () => {
  it('renderService', () => {
    const serviceMap = renderService(apiJson as any);
    expect(serviceMap).toMatchSnapshot();
  });
});
