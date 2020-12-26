import { xml2js, Element } from 'xml-js';

export interface ElementWithId extends Element {
  id: string;
  parentId: string;
}

export interface IWalkXmlCtx {
  indexTrace: number[];
  parent?: Element;
}

export function walkXml(
  current: Element,
  tap: (c: Element, _ctx: IWalkXmlCtx) => void,
  ctx: IWalkXmlCtx = { indexTrace: [0] }
) {
  tap(current, ctx);

  current.elements?.forEach((child, index) => {
    walkXml(child, tap, {
      parent: current,
      indexTrace: ctx.indexTrace.concat(index),
    });
  });
}

export function convertXml2List(input: Element | string) {
  // 复制一遍
  const xml =
    typeof input === 'string'
      ? (xml2js(input, { compact: false }) as Element)
      : (JSON.parse(JSON.stringify(input)) as Element);

  const list: ElementWithId[] = [];

  walkXml(xml, (current, { parent, indexTrace }) => {
    const id = indexTrace.join('.');

    // walk 是深度遍历，parent 一定已经被打过 id 了
    const parentId = parent ? (parent as ElementWithId)!.id : '';

    Object.assign(current, { id, parentId });
    list.push(current as ElementWithId);
  });

  return list;
}

export function matchTrim<T extends string>(text: string, reg: RegExp, flag: T) {
  const match = text.match(reg);
  if (!match) return;

  text = text.replace(reg, '');

  return { text, match, flag };
}
