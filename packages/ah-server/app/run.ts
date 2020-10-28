import { BaseApp, BaseService } from '.';

export class AService extends BaseService {}
export class BService extends BaseService {}

class App extends BaseApp {
  serviceTypes = [AService, BService];
}

(async () => {
  const app = new App();
  await app.start();
})().catch(e => console.error(e));
