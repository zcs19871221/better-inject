import RequestMappingInfo from './request_mapping_info';
import ArgsResolver from './args_resolver';

interface MethodMeta {
  info?: RequestMappingInfo;
  params: {
    type: any;
    name: string;
  }[];
  argsResolver: ArgsResolver[];
  returnValueResolvers: [];
}
interface ModelIniterInfo {
  methodName: string;
  modelKey: string;
}
interface BinderInfo {
  methodName: string;
}
interface MvcMeta {
  methods: { [method: string]: MethodMeta };
  modelIniter: ModelIniterInfo[];
  initBinder: BinderInfo[];
}

export { MethodMeta, MvcMeta, BinderInfo, ModelIniterInfo };
