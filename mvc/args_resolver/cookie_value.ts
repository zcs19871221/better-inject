import { ResolveArgs } from './args_resolver';
import KeyValueArgsResolver from './key_value';

class CookieValue extends KeyValueArgsResolver {
  doResolve(input: ResolveArgs): any {
    const cookie = input.req.headers.cookie || '';
    const cookieMap = cookie
      .split(';')
      .reduce((acc: { [key: string]: string }, each: string) => {
        each = each.trim();
        const [name, value] = each.split('=');
        if (name !== undefined && value !== undefined) {
          acc[name] = value;
        }
        return acc;
      }, {});
    let value;
    if (this.key) {
      value = cookieMap[this.key];
    } else {
      value = cookieMap;
    }
    return value;
  }
}

export const Annotation = KeyValueArgsResolver.AnnotationFactory(
  CookieValue,
  'CookieValue',
  [String],
);
export default CookieValue;
