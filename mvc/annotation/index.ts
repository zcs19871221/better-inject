import MetaHelper from '../../annotation/metaHelper';
import RequestMappingInfo from '../request_mapping_info';
import { ArgsResolver } from '../args_resolver';

interface KeyValueInfo {
  key: string;
  isRequired: boolean;
  targetType: any;
}
interface ModelResolverInfo extends KeyValueInfo {
  type: 'model';
  targetType: any;
}

interface PathVariableResolverInfo extends KeyValueInfo {
  type: 'pathVariable';
}
interface RequestParam extends KeyValueInfo {
  type: 'requestParam';
}
interface RequestHeader extends KeyValueInfo {
  type: 'requestHeader';
}
interface Method {
  type: 'httpMethod';
}
interface RequestBody {
  type: 'requestBody';
  isRequired: boolean;
  targetType: any;
}
type ArgsResolverInfo = (
  | PathVariableResolverInfo
  | ModelResolverInfo
  | Method
  | RequestParam
  | RequestHeader
  | RequestBody
) & { index: number };

interface MethodMeta {
  info?: RequestMappingInfo;
  params: [any, string][];
  argsResolverInfo: ArgsResolver[];
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
      argsResolverInfo: [],
      returnValueResolvers: [],
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

const checkInjectType = (
  ctr: any,
  methodName: string,
  index: number,
  keyName: string,
): 'array' | 'any' => {
  const type = Reflect.getMetadata('design:paramtypes', ctr, methodName)[index];
  if (type === Object) {
    return 'any';
  }
  if (name && (type !== String || type !== Array)) {
    throw new Error(`${keyName}带参数注入类型必须是string或数组`);
  } else if (type !== Map || type !== Object) {
    throw new Error(`${keyName}无参数注入类型必须是Map或对象`);
  }
  if (name && type === Array) {
    return 'array';
  }
  return 'any';
};

interface DataBinder {
  addConveter: (
    targetValue: string,
    targetType: any,
    targetName: string,
  ) => any;
  addValidater: (
    targetValue: string,
    targetType: any,
    targetName: string,
  ) => null;
}

export {
  helper,
  MethodMeta,
  KeyValueInfo,
  MvcMeta,
  PathVariableResolverInfo,
  ArgsResolverInfo,
  checkInjectType,
  DataBinder,
  BinderInfo,
  ModelIniterInfo,
  ModelResolverInfo,
  Method,
  RequestParam,
  RequestHeader,
  RequestBody,
};
