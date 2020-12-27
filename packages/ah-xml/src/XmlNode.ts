import { ITreeNode } from 'ah-tree-helper';
import { Element } from 'xml-js';
import { createQuerySelector } from './QuerySelector';
import { XmlHelper } from './XmlHelper';

type RestParameters<T extends (...args: any) => any> = T extends (_a0: any, ...args: infer P) => any
  ? P
  : never;

export class XmlNode implements ITreeNode {
  // 由 XmlHelper 初始化
  private tree!: XmlHelper;

  constructor(
    readonly id: string,
    readonly parentId: string,
    public meta: {
      xmlElement: Element;
    }
  ) {}

  setTree(tree: XmlHelper) {
    this.tree = tree;
    return this;
  }

  get flatChildren() {
    return this.tree.getFlatChildren(this.id);
  }

  get allChildren() {
    const list: XmlNode[] = [];
    this.walk(c => {
      if (c.id === this.id) return;
      list.push(c);
    });

    return list;
  }

  get parent() {
    return this.tree.getById(this.parentId);
  }

  get attributes() {
    return new Map<string, string>(
      Object.entries(this.meta.xmlElement.attributes || {}).map(([n, v]) => [n, v + ''])
    );
  }

  walk(...args: RestParameters<XmlHelper['walk']>) {
    return this.tree.walk(this.id, ...args);
  }

  query(selector: string) {
    const qs = createQuerySelector(selector);
    return qs.query(this);
  }

  toString() {
    return `<${this.meta.xmlElement.name || '_UnknownTag'} />`;
  }
}

export class XmlElementNode extends XmlNode {
  get tagName() {
    return this.meta.xmlElement.name!;
  }

  toString() {
    const attrStr = [['__id', this.id], ...Array.from(this.attributes.entries())]
      .map(([n, v]) => `${n}="${v}"`)
      .join(' ');

    if (this.flatChildren.length === 0) {
      return `<${this.tagName} ${attrStr}/>`;
    }

    return `<${this.tagName} ${attrStr}>...<${this.tagName}/>`;
  }
}

export class XmlTextNode extends XmlNode {
  get tagName() {
    return '';
  }

  get text() {
    return this.meta.xmlElement.text + '';
  }

  toString() {
    return this.meta.xmlElement.text + '';
  }
}

export class XmlCDataNode extends XmlNode {
  get tagName() {
    return '';
  }

  get cdata() {
    return this.meta.xmlElement.cdata || '';
  }

  toString() {
    return 'cdata';
  }
}
