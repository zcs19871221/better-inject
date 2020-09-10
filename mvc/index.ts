import RequestMappingInfo from './request_mapping_info';
import ArgsResolver from './args_resolver';

interface Param {
  type: any;
  name: string;
}
interface MethodMeta {
  info?: RequestMappingInfo;
  params: Param[];
  argsResolver: ArgsResolver[];
  returnValueResolvers: [];
}
interface ModelIniterInfo {
  methodName: string;
  modelKey: string;
  beanClass: any;
}
interface BinderInfo {
  methodName: string;
  beanClass: any;
}
interface MvcMeta {
  methods: { [method: string]: MethodMeta };
  modelIniter: ModelIniterInfo[];
  initBinder: BinderInfo[];
}

export { MethodMeta, MvcMeta, BinderInfo, ModelIniterInfo, Param };
