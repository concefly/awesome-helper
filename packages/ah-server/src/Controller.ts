import { IContext } from '.';
import { Service } from './Service';

export type IControllerMapperItem = {
  path: string;
  method: 'GET' | 'POST' | 'DELETE' | 'PUT';
  handler: (ctx: IContext) => Promise<void> | void;
};

export abstract class Controller extends Service {
  abstract readonly mapper: IControllerMapperItem[];
}
