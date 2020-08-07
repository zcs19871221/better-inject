import Advice from './advice';

export default class Invoker {
  private target: any;
  private targetMethod: any;
  private proxy: any;
  private args: any[];
  private adviceChains: Advice[];
  private index: number = 0;

  constructor({
    target,
    targetMethod,
    proxy,
    args,
    adviceChains,
  }: {
    target: any;
    targetMethod: any;
    proxy: any;
    args: any[];
    adviceChains: Advice[];
  }) {
    this.target = target;
    this.targetMethod = targetMethod;
    this.proxy = proxy;
    this.args = args;
    this.adviceChains = adviceChains;
  }

  getProxy() {
    return this.proxy;
  }

  getArgs() {
    return this.args;
  }

  callOrigin() {
    return Reflect.get(this.target, this.targetMethod)(...this.args);
  }

  invoke(): any {
    if (this.index === this.adviceChains.length) {
      return this.callOrigin();
    }
    const advice = this.adviceChains[this.index++];
    return advice.invoke(this);
  }
}
