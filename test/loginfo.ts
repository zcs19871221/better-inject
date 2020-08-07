import Invoker from 'aop/Invoker';

export default class LogInfo {
  private logger: any[] = [];

  getLogger() {
    return this.logger;
  }

  cleanLogger() {
    this.logger = [];
  }

  logArgs(invoker: Invoker) {
    this.logger.push('before - args:' + invoker.getArgs());
  }

  after() {
    this.logger.push('after');
  }

  logError(_invoker: Invoker, error: Error) {
    this.logger.push('errorCatch - ' + error.message);
  }

  around(invoker: Invoker) {
    const res = invoker.invoke();
    this.logger.push('around - result:' + res);
    return res;
  }
}
