import { XmlHelper } from '../src';
import * as fs from 'fs';

const xmlRaw1 = fs.readFileSync('__test__/xml1.xml', { encoding: 'utf-8' });

describe('index', () => {
  it('XmlHelper', () => {
    const xml = new XmlHelper(xmlRaw1);
    expect(xml.list).toMatchSnapshot();
  });
});
