import _ from 'lodash';
import { OpenAPIV3 as API } from 'openapi-types';
import { IRequestMeta, IServiceMap, renderService } from './util';

interface IConfig {
  renderRequestMethod(ctx: { requestName: string; meta: IRequestMeta }): string;

  renderServiceCls(ctx: {
    StartCaseServiceName: string;
    camelCaseServiceName: string;
    baseServiceName: string;
    requestMethodLiterals: string[];
  }): string;

  renderFileContent(ctx: { serviceClsLiterals: string[]; serviceMap: IServiceMap }): string;
}

/** API 生成器 */
export class ApiGenerator {
  private config: IConfig = {
    renderRequestMethod: ctx => {
      const cDesc = `/** ${ctx.meta.description || ctx.requestName} */`;
      const crCallArgs = `pathName: '${ctx.meta.pathName}', method: '${ctx.meta.method}'`;

      if (!ctx.meta.query) {
        return `
${cDesc}
${ctx.requestName} = async () => { return this.request({ ${crCallArgs} }); }`;
      }

      const schemaLiteral = JSON.stringify(ctx.meta.query.schema);

      return `
${cDesc}
${ctx.requestName} = async (query: ${ctx.meta.query.tsTypeLiteral}) => {
  return this.request({ ${crCallArgs}, query, schema: ${schemaLiteral} });
}`;
    },

    renderServiceCls: ctx => `
export class ${ctx.StartCaseServiceName}Service extends ${ctx.baseServiceName} {
  ${[ctx.requestMethodLiterals.join('\n')]}      
}`,

    renderFileContent: ctx => ctx.serviceClsLiterals.join('\n\n'),
  };

  constructor(readonly apiDoc: API.Document, _config: Partial<IConfig> = {}) {
    Object.assign(this.config, _config);
  }

  private serviceMap = renderService(this.apiDoc);

  /** 导出成字符串 */
  emitToString(opt: { baseServiceName?: string } = {}) {
    const { baseServiceName = 'BaseService' } = opt;

    const serviceClsLiterals = Object.entries(this.serviceMap).map(([serviceName, serviceData]) => {
      const requestMethodLiterals = Object.entries(serviceData).map(([requestName, reqMeta]) => {
        // 生成请求函数
        return this.config.renderRequestMethod({
          requestName,
          meta: reqMeta,
        });
      });

      // 生成 service
      return this.config.renderServiceCls({
        StartCaseServiceName: _.startCase(serviceName).replace(/\s+/g, ''),
        camelCaseServiceName: _.camelCase(serviceName),
        baseServiceName,
        requestMethodLiterals,
      });
    });

    return this.config.renderFileContent({ serviceClsLiterals, serviceMap: this.serviceMap });
  }

  getServiceMap() {
    return _.cloneDeep(this.serviceMap);
  }
}
