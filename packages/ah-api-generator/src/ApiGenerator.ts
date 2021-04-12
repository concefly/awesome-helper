import _ from 'lodash';
import { OpenAPIV3 as API } from 'openapi-types';
import { renderService } from './util';
import ejs from 'ejs';
import { defaultTemplate } from './template';

/** API 生成器 */
export class ApiGenerator {
  constructor(readonly apiDoc: API.Document) {}

  private serviceMap = renderService(this.apiDoc);

  /** 导出成 ts 文件 */
  emit2Ts(template: string = defaultTemplate, extraData?: any) {
    return ejs.render(template, {
      serviceMap: this.serviceMap,
      ...extraData,
    });
  }

  getServiceMap() {
    return _.cloneDeep(this.serviceMap);
  }
}
