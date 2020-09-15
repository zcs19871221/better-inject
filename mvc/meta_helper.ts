import MetaHelper from '../annotation/metaHelper';
import { MvcMeta, MethodMeta } from '.';

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

  private initMethodData(ctr: any, methodName: string): MethodMeta {
    return {
      returnInfo: {
        type: this.getMethodReturnType(ctr, methodName),
        annotations: [],
      },
      paramInfos: helper.getMethodParam(ctr, methodName).map(e => ({
        ...e,
        annotations: [],
      })),
    };
  }

  getOrInitMethodData(mvcMeta: MvcMeta, methodName: string, ctr: any) {
    if (!mvcMeta.methods[methodName]) {
      mvcMeta.methods[methodName] = this.initMethodData(ctr, methodName);
    }
    return mvcMeta.methods[methodName];
  }
}

const helper = new MvcHelper();

export default helper;
