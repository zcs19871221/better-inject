import { ResolveArgs } from './args_resolver';
import KeyValueArgsResolver from './key_value';

class PathVariableResolver extends KeyValueArgsResolver {
  doResolve(input: ResolveArgs): any {
    const pathMap = input.req.requestMappingInfo.getPathVariableMap();
    let value;
    if (this.key) {
      value = pathMap.get(this.key);
    } else {
      value = pathMap;
    }
    return value;
  }
}
export const Annotation = KeyValueArgsResolver.AnnotationFactory(
  PathVariableResolver,
  'PathVariable',
  [Map, String],
);
export default PathVariableResolver;
