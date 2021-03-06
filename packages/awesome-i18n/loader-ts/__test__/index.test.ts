import Loader from "../lib";

const simpleTypes = [
  `"中文"`,
  `''`,
  `true`,
  `false`,
  `undefined`,
  `null`,
  `Object`,
  `Function`,
  `123`,
  `() => {}`,
];

test("只有 key", () => {
  const fixture = simpleTypes.map((t) => `__(${t})`).join(";");
  const loader = new Loader();
  const result = loader.parse(fixture, "a.ts");
  expect(result).toMatchSnapshot();
});

test("有 key 和 description", () => {
  const fixture = simpleTypes.map((t) => `__('中文', ${t})`).join(";");
  const loader = new Loader();
  const result = loader.parse(fixture, "a.ts");
  expect(result).toMatchSnapshot();
});

test("嵌套", () => {
  const fixture = `foo( bar( __('中文') ) )`;
  const loader = new Loader();
  const result = loader.parse(fixture, "a.ts");
  expect(result).toMatchSnapshot();
});

test("tsx", () => {
  const fixture = `
    const a = <a>{ __('中文') }</a>;
    const b = <div> <div>{ __('中文2') }</div> </div>;
  `;
  const loader = new Loader();
  const result = loader.parse(fixture, "a.tsx");
  expect(result).toMatchSnapshot();
});
