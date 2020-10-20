import helper from './meta_helper';

it('initMetaData', () => {
  expect(helper.initMetaData()).toEqual({
    methods: {},
    modelIniter: [],
    initBinder: [],
    execptionHandlerInfo: [],
  });
});

type X = 'a' | 'b' | 'c';
type Y = [string, number];
interface Z {
  [name: string]: any;
}
type coms = number | string;
function P(_a: any, _b: any, _c: any) {}
function M(_a: any, _b: any) {}
class Target {
  param(
    @P _str: string,
    _num: number,
    _ar: string[],
    _target: Target,
    _x: X,
    _y: Y,
    _z: Z,
    _any: any,
    _coms: coms,
  ) {}

  @M
  return1() {
    return 'string';
  }

  @M
  return2(): string {
    return 'string';
  }
  @M
  return3(): void {}
  @M
  return4(): this {
    return this;
  }
  @M
  return5(): Target {
    return new Target();
  }
  @M
  return6(): any {
    return null;
  }
}
it('getOrInitMethodData', () => {
  const mvcMeta = helper.initMetaData();
  expect(helper.getOrInitMethodData(mvcMeta, 'param', Target)).toEqual({
    returnInfo: {
      type: undefined,
      annotations: [],
    },
    paramInfos: [
      { type: String, name: '_str', annotations: [] },
      { type: Number, name: '_num', annotations: [] },
      { type: Array, name: '_ar', annotations: [] },
      { type: Target, name: '_target', annotations: [] },
      { type: String, name: '_x', annotations: [] },
      { type: Array, name: '_y', annotations: [] },
      { type: Object, name: '_z', annotations: [] },
      { type: Object, name: '_any', annotations: [] },
      { type: Object, name: '_coms', annotations: [] },
    ],
  });
  expect(helper.getOrInitMethodData(mvcMeta, 'return1', Target)).toEqual({
    returnInfo: {
      type: undefined,
      annotations: [],
    },
    paramInfos: [],
  });
  expect(helper.getOrInitMethodData(mvcMeta, 'return2', Target)).toEqual({
    returnInfo: {
      type: String,
      annotations: [],
    },
    paramInfos: [],
  });
  expect(helper.getOrInitMethodData(mvcMeta, 'return3', Target)).toEqual({
    returnInfo: {
      type: undefined,
      annotations: [],
    },
    paramInfos: [],
  });
  expect(helper.getOrInitMethodData(mvcMeta, 'return4', Target)).toEqual({
    returnInfo: {
      type: Object,
      annotations: [],
    },
    paramInfos: [],
  });
  expect(helper.getOrInitMethodData(mvcMeta, 'return5', Target)).toEqual({
    returnInfo: {
      type: Target,
      annotations: [],
    },
    paramInfos: [],
  });
  expect(helper.getOrInitMethodData(mvcMeta, 'return6', Target)).toEqual({
    returnInfo: {
      type: Object,
      annotations: [],
    },
    paramInfos: [],
  });
});
