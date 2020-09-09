import { ResolveArgs } from './args_resolver';
import KeyValueArgsResolver from './key_value';

class RequestParam extends KeyValueArgsResolver {
  doResolve(input: ResolveArgs): any {
    const params = input.req.params;
    let value;
    if (this.key) {
      value = params[this.key];
    } else {
      value = params;
    }
    return value;
  }
}

export const Annotation = KeyValueArgsResolver.AnnotationFactory(
  RequestParam,
  'RequestParam',
  [String],
);
export default RequestParam;
