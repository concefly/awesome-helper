import { App, Service, IService, Config } from '.';

export class AService extends Service {}
export class BService extends Service {}

class DemoApp extends App {
  service: IService = {
    a: new AService(this),
    b: new BService(this),
  };
}

(async () => {
  const app = new DemoApp(new Config());
  await app.start();
})().catch(e => console.error(e));
