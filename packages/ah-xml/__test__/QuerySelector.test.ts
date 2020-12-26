import { createQuerySelector, XmlHelper } from '../src';
import { xmlRaw1 } from './xmlRaw1';

const xml = new XmlHelper(xmlRaw1);
const xmlRoot = xml.findAllRoot()[0].flatChildren[1];

describe('createQuerySelector', () => {
  [
    'div',
    'div   input',
    'div > input',
    'div[title=aa]',
    'div[title=aa] input',
    'div[title=aa] input[type]',
    'div[title=aa] input[type]    >  span',
  ].forEach(selector => {
    const humanizeSelector = `"${selector}"`;

    it(humanizeSelector, () => {
      const qs = createQuerySelector(selector);
      expect(qs.tokens).toMatchSnapshot();
    });
  });
});

describe('QuerySelector', () => {
  [
    'breakfast_menu food name',
    'breakfast_menu food[title=菜名]',
    'breakfast_menu food[title]',
    'breakfast_menu food',
    'food > name[d=1]',
    'name[d]',
    '[title] [d]',
    '[title] [d=1]',
    '[title=菜名] [d=2]',
  ].forEach(selector => {
    const humanizeSelector = `"${selector}"`;

    it(humanizeSelector, () => {
      const res = xmlRoot.query(selector);

      expect(res.map(r => r.toString())).toMatchSnapshot();
    });
  });
});
