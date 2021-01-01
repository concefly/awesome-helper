import { Ts2Schema } from '../src';
import { inspect } from 'util';

export const log = (...args: any[]) => {
  console.log(...args.map(arg => inspect(arg, { showHidden: false, depth: null })));
};

describe('index', () => {
  it('normal', () => {
    const ts2Schema = new Ts2Schema('./tsconfig.json');
    const s = ts2Schema.getSchema('**/fixture.ts');
    expect(s).toMatchSnapshot();
  });
});
