import { Config } from '../src';
import { TestApp } from './DemoApp';

const config = new Config();

describe('App', () => {
  it('整体测试', async () => {
    const app = new TestApp(config);
    await app.start();

    // curl test
    const r1 = await app.curl<any>('http://localhost:10001/echo?text=hi', { dataType: 'text' });
    expect(r1.data).toEqual('hi');

    // post body test
    const r2 = await app.curl<any>('http://localhost:10001/echo', {
      method: 'POST',
      contentType: 'json',
      dataType: 'text',
      data: {
        text: 'hi',
      },
    });
    expect(r2.data).toEqual('hi');

    await app.stop();
  });
});
