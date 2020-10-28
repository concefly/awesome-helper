import { Schema, validate as jsonschemaValidate } from 'jsonschema';
import { Context } from 'koa';

/** jsonschema 校验 */
export function validate<T>(this: Context, data: any, schema: Schema): T {
  const result = jsonschemaValidate(data, schema);
  if (result.errors.length === 0) return data;

  const errMsg = result.errors.map(e => e.message).join(';');
  throw new Error(errMsg);
}
