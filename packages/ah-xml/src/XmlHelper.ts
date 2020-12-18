import { TreeHelper } from 'ah-tree-helper';
import { convertXml2List } from './util';
import { XmlNode } from './XmlNode';

export class XmlHelper extends TreeHelper<XmlNode> {
  constructor(readonly raw: string) {
    super(
      convertXml2List(raw).map(ele => {
        return new XmlNode(ele.id, ele.parentId, { xmlElement: ele });
      })
    );

    // 设置 tree
    this.list.forEach(t => t.setTree(this));
  }
}
