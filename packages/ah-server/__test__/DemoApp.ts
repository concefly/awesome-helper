import { App, Controller, IContext, IControllerMapperItem, IService, Service } from '../src';

class EchoService extends Service {
  echo(text: string) {
    return text;
  }
}

class EchoController extends Controller {
  mapper: IControllerMapperItem[] = [
    {
      path: '/echo',
      method: 'GET',
      handler: this.echo,
    },
  ];

  echo(ctx: IContext) {
    const input: string = ctx.request.query.text;
    const output = (this.service as any).echo.echo(input);

    ctx.body = output;
  }
}

export class TestApp extends App {
  service: IService = {
    echo: new EchoService(this),
  };
  controllerList: Controller[] = [new EchoController(this)];
  schedulerList = [];
  logger = {
    info() {},
    error(msg: string) {
      throw new Error(msg);
    },
  } as any;
}
