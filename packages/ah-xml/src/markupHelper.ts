import { XmlElementNode, XmlNode, XmlTextNode } from './XmlNode';

export function noteToHTML(
  node: XmlNode,
  opt?: {
    tapAttrs?(attrs: [string, string][], current: XmlNode): [string, string][];
  }
): string {
  const selfCloseTagSet = new Set<string>(['br', 'img']);

  const convertXml2Html = (current: XmlNode): string => {
    if (current instanceof XmlElementNode) {
      const tag = current.tagName;

      let attributes = Array.from(current.attributes.entries());

      if (opt?.tapAttrs) {
        attributes = opt.tapAttrs(attributes, current);
      }

      const attrStr = attributes.map(([_n, _v]) => `${_n}="${_.escape(_v)}"`).join(' ');
      const isSelfClose = selfCloseTagSet.has(tag) && current.flatChildren.length === 0;

      if (isSelfClose) {
        return `<${tag} ${attrStr} />`;
      }

      const childrenStr = current.flatChildren.map(convertXml2Html).join('\n');
      return `<${tag} ${attrStr}>${childrenStr}</${tag}>`;
    }

    if (current instanceof XmlTextNode) return current.text;

    return '';
  };

  return convertXml2Html(node);
}
