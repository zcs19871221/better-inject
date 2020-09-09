import { ResolveArgs } from './args_resolver';
import KeyValueArgsResolver from './key_value';

class RequestHeader extends KeyValueArgsResolver {
  doResolve(input: ResolveArgs): any {
    const headers = input.req.headers;
    let value;
    if (this.key) {
      value = headers[this.key];
    } else {
      value = headers;
    }
    return value;
  }
}

export const Annotation = KeyValueArgsResolver.AnnotationFactory(
  RequestHeader,
  'RequestHeader',
  [String],
);
export default RequestHeader;
