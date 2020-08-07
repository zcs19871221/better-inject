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
    const msg = 'before - args:' + invoker.getArgs();
    console.log(msg);
    this.logger.push(msg);
  }

  after() {
    const msg = 'after';
    console.log(msg);
    this.logger.push(msg);
  }

  logError(_invoker: Invoker, error: Error) {
    const msg = 'errorCatch - ' + error.message;
    console.log(msg);
    this.logger.push(msg);
  }

  around(invoker: Invoker) {
    const msg = 'around - start';
    console.log(msg);
    const res = invoker.invoke();
    console.log('around - end');
    this.logger.push(msg);
    return res;
  }
}
