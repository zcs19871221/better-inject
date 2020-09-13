import MetaHelper from '../../annotation/metaHelper';
import { MvcMeta, MethodMeta } from '..';

class MvcHelper extends MetaHelper<MvcMeta> {
  constructor() {
    super('__mvc meta data');
  }

  initMetaData() {
    return {
      methods: {},
      modelIniter: [],
      initBinder: [],
    };
  }

  initMethodData(): MethodMeta {
    return {
      params: [],
      argsResolver: [],
      returnValueHandler: [],
      returnType: undefined,
    };
  }

  getOrInitMethodData(mvcMeta: MvcMeta, methodName: string) {
    if (!mvcMeta.methods[methodName]) {
      mvcMeta.methods[methodName] = this.initMethodData();
    }
    return mvcMeta.methods[methodName];
  }
}

const helper = new MvcHelper();

export default helper;
