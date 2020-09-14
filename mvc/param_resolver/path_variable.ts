import KeyValueParamResolver from './key_value';
import { ResolveParamArgs } from './param_resolver';

export default class PathVariableResolver extends KeyValueParamResolver {
  constructor() {
    super('PathVariable');
  }

  getMap(resolveParamArgs: ResolveParamArgs) {
    const req = resolveParamArgs.webRequest.getRequest();
    return req.requestMappingInfo.getPathVariableMap();
  }
}

export const instance = new PathVariableResolver();
export const PathVariable = instance.Annotation;
