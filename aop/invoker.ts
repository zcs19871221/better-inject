import Advisor from './adivsor';

export default class Invoker {
  private target: any;
  private targetMethod: any;
  private proxy: any;
  private args: any[];
  private advisorChains: Advisor[];
  private index: number = 0;

  constructor({
    target,
    targetMethod,
    proxy,
    args,
    advisorChains,
  }: {
    target: any;
    targetMethod: any;
    proxy: any;
    args: any[];
    advisorChains: Advisor[];
  }) {
    this.target = target;
    this.targetMethod = targetMethod;
    this.proxy = proxy;
    this.args = args;
    this.advisorChains = advisorChains;
  }

  getProxy() {
    return this.proxy
  }
  
  callOrigin() {
    return Reflect.get(this.target, this.targetMethod)(...this.args)
  }

  invoke(): any {
    if (this.index === this.advisorChains.length - 1) {
      return this.callOrigin();
    }
    const advisor = this.advisorChains[this.index++];
    return advisor.invoke(this);
  }
}
