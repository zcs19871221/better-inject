import MetaHelper from '../../annotation/metaHelper';
import RequestMappingInfo from '../request_mapping_info';

interface RequestResolverInfo {
  type: 'request';
}
interface ResponseResolverInfo {
  type: 'response';
}
interface ModelResolverInfo {
  type: 'model';
}

interface PathVariableResolverInfo {
  type: 'pathVariable';
  pathVariableName: string;
}
interface RequestParam {
  type: 'requestParam';
  requestParamName: string;
  isRequired: boolean;
  targetType: any;
}
interface RequestHeader {
  type: 'requestHeader';
  headerKey: string;
  isRequired: boolean;
  targetType: any;
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
  | RequestResolverInfo
  | ResponseResolverInfo
  | ModelResolverInfo
  | Method
  | RequestParam
  | RequestHeader
  | RequestBody
) & { index: number };

interface MethodMeta {
  info?: RequestMappingInfo;
  argsResolverInfo: ArgsResolverInfo[];
  returnValueResolvers: [];
}
interface MvcMeta {
  methods: { [method: string]: MethodMeta };
  modelIniter: {
    methodName: string;
    modelKey: string;
  }[];
  converters: {
    targetClass: any;
    methodName: string;
  }[];
}

class MvcHelper extends MetaHelper<MvcMeta> {
  constructor() {
    super('__mvc meta data');
  }

  initMetaData() {
    return {
      methods: {},
      modelIniter: [],
      converters: [],
    };
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

export { helper, PathVariableResolverInfo, ArgsResolverInfo, checkInjectType };
