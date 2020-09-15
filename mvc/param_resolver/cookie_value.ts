import KeyValueParamResolver, {
  Annotation as AnnotationFactory,
} from './key_value';
import { ResolveParamArgs } from './resolver';

export default class CookieValueResolver extends KeyValueParamResolver {
  constructor() {
    super('CookieValue');
  }

  protected getMap(resolveParamArgs: ResolveParamArgs) {
    return resolveParamArgs.webRequest.getRequestCookie();
  }
}
export const Annotation = AnnotationFactory('CookieValue');
