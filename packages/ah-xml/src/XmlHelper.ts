import { TreeHelper } from 'ah-tree-helper';
import { convertXml2List } from './util';
import { XmlElementNode, XmlNode, XmlTextNode, XmlCDataNode } from './XmlNode';

function convertInput2NodeList(input: string) {
  const eleTypeMapper = new Map<string, typeof XmlNode>([
    ['text', XmlTextNode],
    ['element', XmlElementNode],
    ['cdata', XmlCDataNode],
  ]);

  return convertXml2List(input).map(ele => {
    const EleType = eleTypeMapper.get(ele.type!) || XmlNode;
    return new EleType(ele.id, ele.parentId, { xmlElement: ele });
  });
}

export class XmlHelper extends TreeHelper<XmlNode> {
  constructor(readonly raw: string) {
    super(convertInput2NodeList(raw));

    // 设置 tree
    this.list.forEach(t => t.setTree(this));
  }
}
