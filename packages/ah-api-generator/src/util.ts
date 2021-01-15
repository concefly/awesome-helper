import { OpenAPIV3 as API } from 'openapi-types';
import _ from 'lodash';
import { Schema } from 'jsonschema';

import { inspect } from 'util';

export const log = (...args: any[]) => {
  console.log(...args.map(arg => inspect(arg, { showHidden: false, depth: null })));
};

export function parseRequestSchema(
  data:
    | API.PathItemObject['get']
    | API.PathItemObject['put']
    | API.PathItemObject['post']
    | API.PathItemObject['delete']
): Schema | undefined {
  if (!data) return;

  const schema: Schema = {
    type: 'object',
    properties: {},
  };

  if (data.parameters) {
    (data.parameters as API.ParameterObject[]).forEach(p => {
      Object.assign(schema.properties!, {
        [p.name]: p.schema,
      });
    });
  }

  if (data.requestBody) {
    const requestBodyContentJson = (data.requestBody as API.RequestBodyObject).content[
      'application/json'
    ];

    if (typeof (requestBodyContentJson?.schema as any)?.type !== 'undefined') {
      const jSchema = requestBodyContentJson?.schema as Schema;
      _.merge(schema, jSchema);
    }
  }

  // 没有收集到，返回空
  if (_.isEmpty(schema.properties)) return;

  return schema;
}

export type IRequestMeta = {
  reqSchema?: Schema;
  parameters: {
    name: string;
    tsType: string;
  }[];
  body: string;
};

export interface IServiceMap {
  [serviceName: string]: {
    [requestName: string]: IRequestMeta;
  };
}

export function renderService(apiDoc: API.Document) {
  const serviceMap: IServiceMap = {};

  Object.entries(apiDoc.paths).forEach(([pathName, pi]) => {
    if (!pi) return;

    Object.entries({
      get: pi.get,
      put: pi.put,
      post: pi.post,
      delete: pi.delete,
    }).forEach(([method, commonPiData]) => {
      if (!commonPiData) return;

      const [serviceName, requestName] = (
        commonPiData.operationId || `default.${_.camelCase(pathName)}`
      ).split('.');

      const reqSchema = parseRequestSchema(commonPiData);
      const hasQuery = !!reqSchema;

      const parameters = hasQuery
        ? [
            {
              name: 'query',
              tsType: schema2TsTypeLiteral(reqSchema),
            },
          ]
        : [];

      const requestMeta: IRequestMeta = {
        reqSchema,
        parameters,
        body: `return this.request({ pathName: '${pathName}', method: '${method}', ${
          hasQuery ? 'query' : ''
        } });`,
      };

      //
      _.set(serviceMap, [serviceName, requestName], requestMeta);
    });
  });

  return serviceMap;
}

export function schema2TsTypeLiteral(s?: Schema): string {
  if (!s) return 'never';

  if (s.type === 'string') return 'string';
  if (s.type === 'integer') return 'number';

  if (s.type === 'object') {
    {
      if (s.properties) {
        return [
          '{',
          Object.entries(s.properties).map(([pn, pv]) => {
            const isRequired =
              typeof s.required === 'boolean'
                ? s.required
                : Array.isArray(s.required)
                ? s.required.includes(pn)
                : false;

            const tsType = schema2TsTypeLiteral(pv);

            return `${pn}${isRequired ? '' : '?'}: ${tsType}`;
          }),
          '}',
        ].join(' ');
      }

      return 'object';
    }
  }

  return 'any';
}
