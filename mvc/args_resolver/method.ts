import ArgsResolver, { ResolveArgs } from './args_resolver';
import helper from '../annotation/helper';

class Method implements ArgsResolver {
  private index: number;

  constructor(index: number) {
    this.index = index;
  }

  resolve(input: ResolveArgs) {
    const value = input.req.method;
    if (value === undefined) {
      throw new Error('method undefined');
    }
    return value;
  }

  getIndex() {
    return this.index;
  }
}
export const Annotation = (ctr: any, methodName: string, index: number) => {
  const mvcMeta = helper.getIfNotExisisInit(ctr, true);
  const methodMeta = helper.getOrInitMethodData(mvcMeta, methodName);
  methodMeta.argsResolver.push(new Method(index));
  helper.set(ctr, mvcMeta);
};

export default Method;
