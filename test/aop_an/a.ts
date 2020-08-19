import {
  Aspect,
  Before,
  After,
  Around,
  AfterReturn,
  AfterThrow,
  PointCut,
  Invoker,
  Resource,
} from '../../';

@Aspect()
@Resource({ type: 'single' })
export default class TestAspect {
  private logger: string[] = [];

  setLogger(logger: string[]) {
    this.logger = logger;
  }

  getLogger() {
    return this.logger;
  }
  @PointCut(/c1/, /^get/)
  p1() {}

  @Before('p1')
  logArgs(invoker: Invoker) {
    this.logger.push('before:' + invoker.getArgs());
  }

  @Around('p1')
  around(invoker: Invoker) {
    this.logger.push('around start');
    const res = invoker.invoke();
    this.logger.push('around end');
    return res;
  }

  @After({ classMatcher: /c1/, methodMatcher: /^get/ })
  after() {
    this.logger.push('after');
  }

  @AfterReturn({ classMatcher: /c1/, methodMatcher: /^get/ })
  afterReturn(_invoker: Invoker, res: any) {
    this.logger.push('return res:' + res);
  }

  @AfterThrow('globalPointCutC1')
  afterThrow(_invoker: Invoker, error: Error) {
    this.logger.push('catched error:' + error.message);
  }
}
