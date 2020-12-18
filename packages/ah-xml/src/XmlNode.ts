import { ITreeNode } from 'ah-tree-helper';
import { Element } from 'xml-js';
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

  get parent() {
    return this.tree.getById(this.parentId);
  }

  get attributes() {
    return this.meta.xmlElement.attributes;
  }

  walk(...args: RestParameters<XmlHelper['walk']>) {
    return this.tree.walk(this.id, ...args);
  }
}
