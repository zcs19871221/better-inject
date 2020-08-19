import { Invoker, Resource } from '../..';

@Resource({ type: 'single' })
export default class TestAspect2 {
  private logger: string[] = [];

  getLogger() {
    return this.logger;
  }
  setLogger(logger: string[]) {
    this.logger = logger;
  }
  logArgs(invoker: Invoker) {
    this.logger.push('before2:' + invoker.getArgs());
  }

  around(invoker: Invoker) {
    this.logger.push('around2 start');
    invoker.invoke();
    this.logger.push('around2 end');
    return 'fuck';
  }

  after() {
    this.logger.push('after2');
  }

  afterReturn(_invoker: Invoker, res: any) {
    this.logger.push('return res2:' + res);
  }

  afterThrow(_invoker: Invoker, error: Error) {
    this.logger.push('catched error2:' + error.message);
  }
}
