import { XmlHelper } from '../src';
import { xmlRaw1 } from './xmlRaw1';

describe('index', () => {
  it('XmlHelper', () => {
    const xml = new XmlHelper(xmlRaw1);
    expect(xml.list.map(n => n.toString())).toMatchSnapshot();
  });
});
