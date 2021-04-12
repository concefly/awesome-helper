export const defaultTemplate = `
import { BaseService } from './BaseService';

<% for (const [sName, rMap] of Object.entries(serviceMap)) { %>
<% for (const [rName, rMeta] of Object.entries(rMap)) { %>
export type I<%= sName %>Service_<%= rName %>_Query = <% if (rMeta.query && rMeta.query.tsTypeLiteral) { %><%- rMeta.query.tsTypeLiteral %><% } else { %>any<% } %>;
export type I<%= sName %>Service_<%= rName %>_Resp = <% if (rMeta.response && rMeta.response.tsTypeLiteral) { %><%- rMeta.response.tsTypeLiteral %><%} else { %>any<% } %>;
<% } %>
<% } %>

<% for (const [sName, rMap] of Object.entries(serviceMap)) { %>
export class <%= sName %>Service extends BaseService {
  <% for (const [rName, rMeta] of Object.entries(rMap)) { %>
  /**
   * <%= sName %>Service.<%= rName %>
   * 
   * - description: <%- rMeta.description %>
   * - pathName: <%- rMeta.pathName %>
   * - method: <%- rMeta.method %>
   */
  public <%= rName %> = async (<% if (rMeta.query) { %>query: I<%= sName %>Service_<%= rName %>_Query <% } %>) => {
    return this.request<I<%= sName %>Service_<%= rName %>_Resp>(
      replaceUrlParams('<%- rMeta.pathName %>', <% if (rMeta.query) { %>query,<% } %>),
      '<%- rMeta.method %>',
      <% if (rMeta.query) { %>query,<% } %>
    )
  }
  <% } %>
}
<% } %>

export function replaceUrlParams(url: string, data?: any) {
  if (!data) return url;

  const match = url.match(/\\:\\w+/g);
  if (match) {
    const pnSet = new Set(match.map(p => p.replace(/^\\:/, '')));
    pnSet.forEach(p => {
      url = url.replace(new RegExp(\`\\\\:\${p}\`, 'g'), data[p]);
    });
  }
  
  return url;
}
  `;
