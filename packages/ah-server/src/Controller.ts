import { IContext } from '.';
import { Service } from './Service';

type IRouterMethod = 'GET' | 'POST' | 'DELETE' | 'PUT';

export type IControllerMapperItem = {
  path: string;
  method: IRouterMethod | IRouterMethod[];
  handler: (ctx: IContext) => Promise<void> | void;
};

export abstract class Controller extends Service {
  abstract readonly mapper: IControllerMapperItem[];
}
