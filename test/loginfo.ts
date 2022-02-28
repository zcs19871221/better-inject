import Invoker from '../aop/invoker_implement';

export default class LogInfo {
  private logger!: any[];

  setLogger(logger: any[]) {
    this.logger = logger;
  }

  logArgs(invoker: Invoker) {
    this.logger.push(
      `invoke before - originargs:${invoker.getArgs()} originmethod:${invoker.getTargetMethod()}`,
    );
  }

  after() {
    this.logger.push('invoke after');
  }

  logResult(_invoker: Invoker, res: any) {
    this.logger.push('invoke afterReturn - res:' + res);
  }

  logError(_invoker: Invoker, error: Error) {
    this.logger.push(`invoke afterThrow - errorMsg:${error.message}`);
  }

  around(invoker: Invoker) {
    this.logger.push(`invoke around start`);
    const res = invoker.invoke();
    this.logger.push(`invoke around end`);
    return res;
  }
}
