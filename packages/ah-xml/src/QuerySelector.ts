import { matchTrim } from './util';
import { XmlNode, XmlElementNode } from './XmlNode';

/** 选择器 */
abstract class BaseSelector {
  abstract test(n: XmlNode): boolean;
}

/** 分组选择器 */
abstract class BaseGroupingSelector extends BaseSelector {}

/** 组合器 */
abstract class BaseCombinator {
  abstract filter(n: XmlNode): XmlNode[];
}

export type IQuerySelectorToken = BaseSelector | BaseGroupingSelector | BaseCombinator;

export class QuerySelector {
  constructor(readonly tokens: IQuerySelectorToken[]) {}

  addToken(t: IQuerySelectorToken) {
    const lastToken = this.tokens[this.tokens.length - 1];

    if (lastToken instanceof BaseCombinator) {
      if (t instanceof BaseCombinator) throw new Error('非法：组合器+组合器');
    }

    this.tokens.push(t);
    return this;
  }

  query(node: XmlNode) {
    let nodeList: XmlNode[] = [node].concat(node.allChildren);

    for (const t of this.tokens) {
      // BaseSelector or BaseGroupingSelector
      if (t instanceof BaseSelector || t instanceof BaseGroupingSelector) {
        nodeList = nodeList.filter(n => t.test(n));

        if (nodeList.length === 0) return [];
      }

      // BaseCombinator
      else if (t instanceof BaseCombinator) {
        let addNodeList: XmlNode[] = [];

        nodeList.forEach(n => {
          addNodeList = addNodeList.concat(t.filter(n));
        });

        nodeList = nodeList.concat(addNodeList);
      }
    }

    return nodeList;
  }
}

/** 元素选择器 */
export class TypeSelector extends BaseSelector {
  constructor(readonly tag: string) {
    super();
  }

  test(n: XmlNode) {
    if (n instanceof XmlElementNode) {
      return n.tagName.toUpperCase() === this.tag.toUpperCase();
    }

    return false;
  }
}

/** 属性选择器 */
export class AttributeSelector extends BaseSelector {
  constructor(readonly attrName: string, readonly valueReg?: RegExp) {
    super();
  }

  test(n: XmlNode) {
    if (!n.attributes) return false;
    if (typeof n.attributes.get(this.attrName) === 'undefined') return false;

    const value = n.attributes.get(this.attrName) + '';
    if (this.valueReg) return this.valueReg.test(value);

    return true;
  }
}

/** 选择器列表 */
export class SelectorList extends BaseGroupingSelector {
  constructor(readonly list: BaseSelector[]) {
    super();
  }

  test(n: XmlNode) {
    return this.list.some(s => s.test(n));
  }
}

/** 后代组合器 */
export class DescendantCombinator extends BaseCombinator {
  filter(n: XmlNode) {
    return n.allChildren;
  }
}

/** 直接子代组合器 */
export class ChildCombinator extends BaseCombinator {
  filter(n: XmlNode) {
    return n.flatChildren;
  }
}

export function createQuerySelector(selector: string): QuerySelector {
  // 规整 selector
  selector = selector.trim();
  selector = selector.replace(/\s+/g, ' ');

  const qs = new QuerySelector([]);

  let cnt = 99999;
  while (cnt-- > 0) {
    const mr =
      // selector
      matchTrim(selector, /^([\w_-]+)/, 'tag') ||
      matchTrim(selector, /^\[([\w_-]+)\]/, 'attr1') ||
      matchTrim(selector, /^\[([\w_-]+)=(.+?)\]/, 'attr2') ||
      // combinator
      matchTrim(selector, /^\s+(?![>])/, 'DescendantCombinator') ||
      matchTrim(selector, /^\s?\>\s?/, 'ChildCombinator');

    if (!mr) break;

    // 设置剩余部分
    selector = mr.text;

    switch (mr.flag) {
      case 'tag': {
        const tag = mr.match[1];
        qs.addToken(new TypeSelector(tag));
        break;
      }

      case 'attr1': {
        const attrName = mr.match[1];
        qs.addToken(new AttributeSelector(attrName));
        break;
      }

      case 'attr2': {
        const attrName = mr.match[1];
        const attrValue = mr.match[2];
        qs.addToken(new AttributeSelector(attrName, new RegExp(`^${attrValue}$`)));
        break;
      }

      case 'DescendantCombinator': {
        qs.addToken(new DescendantCombinator());
        break;
      }

      case 'ChildCombinator': {
        qs.addToken(new ChildCombinator());
        break;
      }

      default:
        throw new Error('不支持' + (mr as any).flag);
    }
  }

  if (selector.length) throw new Error(`"${selector}" 解析出错`);

  return qs;
}
