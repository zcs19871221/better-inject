import Invoker from '../aop/Invoker';

export default class LogInfo {
  private logger: any[] = [];

  getLogger() {
    return this.logger;
  }

  cleanLogger() {
    this.logger = [];
  }

  logArgs(invoker: Invoker) {
    const msg = 'before1 - args:' + invoker.getArgs();
    console.log(msg);
    this.logger.push(msg);
  }

  after() {
    const msg = 'after1';
    console.log(msg);
    this.logger.push(msg);
  }

  logError(_invoker: Invoker, error: Error) {
    const msg = 'errorCatch1 - ' + error.message;
    console.log(msg);
    this.logger.push(msg);
  }

  around(invoker: Invoker) {
    const msg = 'around1 - start';
    console.log(msg);
    const res = invoker.invoke();
    console.log('around1 - end');
    this.logger.push(msg);
    return res;
  }
}
