import KeyValueParamResolver, {
  Annotation as AnnotationFactory,
} from './key_value';
import { ResolveParamArgs } from './resolver';

export default class RequestParamResolver extends KeyValueParamResolver {
  constructor() {
    super('RequestParam');
  }

  getMap(resolveParamArgs: ResolveParamArgs) {
    return resolveParamArgs.webRequest.getRequestParamMap();
  }
}

export const instance = new RequestParamResolver();
export const Annotation = AnnotationFactory('RequestParam');
