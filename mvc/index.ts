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

interface MvcMeta {
  methods: { [method: string]: MethodMeta };
  modelIniter: ModelMetaInfo[];
  initBinder: BinderInfo[];
  requestMappingMethods: string[];
}

export { MethodMeta, MvcMeta, ModelMetaInfo, ParamInfo };
