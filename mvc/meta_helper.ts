import MetaHelper from '../annotation/metaHelper';
import RequestMappingInfo from './request_mapping_info';
import { ReturnInfo } from './return_value_handler/return_value_handler';
import { ParamInfo } from './param_resolver/resolver';
import { BinderInfo } from './data_binder';
import ModelMetaInfo from './model_attribute/metainfo';

interface MethodMeta {
  mappingInfo?: RequestMappingInfo;
  paramInfos: ParamInfo[];
  returnInfo: ReturnInfo;
}
interface ExecptionHandlerInfo {
  exceptionType: Error;
  methodName: string;
  beanClass: any;
}
interface MvcMeta {
  methods: { [method: string]: MethodMeta };
  modelIniter: ModelMetaInfo[];
  initBinder: BinderInfo[];
  execptionHandlerInfo: ExecptionHandlerInfo[];
}

class MvcHelper extends MetaHelper<MvcMeta> {
  constructor() {
    super('__mvc meta data');
  }

  initMetaData() {
    return {
      methods: {},
      modelIniter: [],
      initBinder: [],
      execptionHandlerInfo: [],
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
export { MethodMeta, MvcMeta, ModelMetaInfo, ParamInfo, ExecptionHandlerInfo };
