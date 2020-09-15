import helper from './meta_helper';

it('initMetaData', () => {
  expect(helper.initMetaData()).toEqual({
    methods: {},
    modelIniter: [],
    initBinder: [],
  });
});

class Target {
  param(
    _str: string,
    _num: number,
    _ar: string[],
    _target: Target,
    _any: any,
  ) {}

  return1() {
    return 'string';
  }
  return2(): string {
    return 'string';
  }
  return3(): void {}
  return4(): this {
    return this;
  }
  return5(): Target {
    return new Target();
  }
  return6(): any {
    return null;
  }
}
it('getOrInitMethodData', () => {
  const target = new Target();
  const mvcMeta = helper.initMetaData();
  expect(helper.getOrInitMethodData(mvcMeta, 'param', target)).toEqual({
    returnInfo: {
      type: undefined,
      annotations: [],
    },
    paramInfos: [{ type: '', name: '', annotations: [] }],
  });
});
