import ArgsResolver, { ResolveArgs } from './args_resolver';
import helper from '../annotation/helper';

interface KeyValueInput {
  name: string;
  key: string;
  isRequired: boolean;
  type: any;
  acceptTypes: any[];
  index: number;
}
interface KeyValueCtr {
  new (args: KeyValueInput): KeyValueArgsResolver;
}
export default abstract class KeyValueArgsResolver implements ArgsResolver {
  protected key: string;
  protected isRequired: boolean;
  protected type: any;
  private index: number;
  constructor(args: KeyValueInput) {
    if (!args.acceptTypes.concat(Object).includes(args.type)) {
      throw new Error(
        `${name}不支持注入类型${args.type},只支持${args.acceptTypes.join(',')}`,
      );
    }
    this.key = args.key;
    this.isRequired = args.isRequired;
    this.index = args.index;
  }

  getIndex() {
    return this.index;
  }

  static AnnotationFactory(Ctr: KeyValueCtr, name: string, acceptTypes: any[]) {
    return (key: string = '', isRequired = true) => {
      return (ctr: any, methodName: string, index: number) => {
        const resolver = new Ctr({
          name,
          key,
          isRequired,
          type: helper.getMethodParamTypes(ctr, methodName, index),
          acceptTypes,
          index,
        });
        const mvcMeta = helper.getIfNotExisisInit(ctr, true);
        const methodMeta = helper.getOrInitMethodData(mvcMeta, methodName);
        methodMeta.argsResolver.push(resolver);
        helper.set(ctr, mvcMeta);
      };
    };
  }

  resolve(input: ResolveArgs): any {
    const value = this.doResolve(input);
    this.checkValue(value);
    return value;
  }

  protected abstract doResolve(input: ResolveArgs): any;

  protected checkValue(value: any) {
    if (value === undefined && this.isRequired) {
      throw new Error(`${name}的键${this.key}值不存在`);
    }
  }
}
