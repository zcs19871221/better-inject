import Invoker from '../aop/Invoker';

export default class LogInfo {
  private logger!: any[];

  setLogger(logger: any[]) {
    this.logger = logger;
  }

  logArgs(invoker: Invoker) {
    this.logger.push(
      `invoke before1 - originargs:${invoker.getArgs()} originmethod:${invoker.getTargetMethod()}`,
    );
  }

  after() {
    this.logger.push('invoke after1');
  }

  logResult(_invoker: Invoker, res: any) {
    this.logger.push('invoke afterReturn1 - res:' + res);
  }

  logError(_invoker: Invoker, error: Error) {
    this.logger.push(`invoke afterThrow1 - errorMsg:${error.message}`);
  }

  around(invoker: Invoker) {
    this.logger.push(`invoke around1 start`);
    const res = invoker.invoke();
    this.logger.push(`invoke around1 end`);
    return res;
  }
}
