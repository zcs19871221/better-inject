import RequestMappingInfo from './request_mapping_info';
import { ReturnInfo } from './return_value_handler/return_value_handler';
import { ParamInfo } from './param_resolver/resolver';
import { BinderInfo } from './data_binder';

interface MethodMeta {
  mappingInfo?: RequestMappingInfo;
  paramInfos: ParamInfo[];
  returnInfo: ReturnInfo;
}
interface ModelIniterInfo {
  methodName: string;
  modelKey: string;
  beanClass: any;
}

interface MvcMeta {
  methods: { [method: string]: MethodMeta };
  modelIniter: ModelIniterInfo[];
  initBinder: BinderInfo[];
}

export { MethodMeta, MvcMeta, ModelIniterInfo, ParamInfo };
