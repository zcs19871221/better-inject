import Advice from './advice';
import Context from '../context';
import Invoker from './invoker';

export default class InvokerImplement implements Invoker {
  private target: any;
  private targetMethod: any;
  private proxy: any;
  private args: any[];
  private adviceChains: Advice[];
  private index: number = 0;
  private exposeProxy: boolean;

  constructor({
    target,
    targetMethod,
    proxy,
    args,
    adviceChains,
    exposeProxy = false,
  }: {
    target: any;
    targetMethod: any;
    proxy: any;
    args: any[];
    adviceChains: Advice[];
    exposeProxy: boolean;
  }) {
    this.target = target;
    this.targetMethod = targetMethod;
    this.proxy = proxy;
    this.args = args;
    this.exposeProxy = exposeProxy;
    this.adviceChains = adviceChains;
  }

  getProxy() {
    return this.proxy;
  }

  getArgs() {
    return this.args;
  }

  callOrigin() {
    return Reflect.apply(
      Reflect.get(this.target, this.targetMethod),
      this.target,
      this.args,
    );
  }

  getTargetMethod() {
    return this.targetMethod;
  }

  invoke(): any {
    try {
      if (this.exposeProxy) {
        Context.setProxy(this.target, this.proxy);
      }
      if (this.index === this.adviceChains.length) {
        return this.callOrigin();
      }
      const advice = this.adviceChains[this.index++];
      return advice.invoke(this);
    } finally {
      Context.delProxy(this.target);
    }
  }
}
