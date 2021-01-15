function addMeta(meta: string) {
  return function (_target: any, _name: string, _desc: PropertyDescriptor) {};
}

export function foo(name: string, age: number, _info: { city: string }) {
  return {
    name: name + 'x',
    age: age + 'x',
    list: [name, age, { extra: { chinese: true } }] as any,
  };
}

export class Animal {
  flag = 'x';

  foo(_name: string, _age: number, _info: { city: string }) {
    return '_string';
  }

  foo2() {
    return 1;
  }

  foo3() {
    return { data: '_string' };
  }

  foo4() {
    return { foo3Result: this.foo3() };
  }
}

export class Cat extends Animal {
  foo5() {
    return { data: new Animal().foo4() };
  }

  @addMeta('meta')
  async walk() {
    return 1;
  }
}
