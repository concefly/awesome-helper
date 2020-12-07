import { Config } from '../src';
import { TestApp } from './DemoApp';

const config = new Config();

describe('App', () => {
  it('整体测试', async () => {
    const app = new TestApp(config);
    await app.start();

    // curl test
    const data = await app.curl<any>('http://localhost:10001/echo?text=hi', { dataType: 'text' });
    expect(data.data).toEqual('hi');

    await app.stop();
  });
});
