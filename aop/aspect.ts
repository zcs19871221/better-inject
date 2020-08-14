import { AdviceCtr, Advice_Position } from './advice';
import BeforeAdvice from './before_advice';
import AfterAdvice from './after_advice';
import AroundAdvice from './around_advice';
import AfterReturnAdvice from './after_return_advice';
import AfterThrowAdvice from './after_throw_advice';
import BeanFactory from '../factory';
import Advisor from './advisor';

type Matcher = String | RegExp;
interface POINT_CUT_MATCHER {
  classMatcher: Matcher | Matcher[];
  methodMatcher: Matcher | Matcher[];
}
interface POINT_CUT extends POINT_CUT_MATCHER {
  id: string;
  type: 'pointcut';
}

interface ASPECT_ARGS {
  id: string;
  adviceId: any;
  pointCuts?: POINT_CUT[];
  order?: number;
  adviceConfigs: [
    typeof Advice_Position[number],
    string,
    string | POINT_CUT_MATCHER,
  ][];
  type: 'aspect';
  beanFactory: BeanFactory;
}

export { POINT_CUT_MATCHER, POINT_CUT, ASPECT_ARGS };
export default class Aspect {
  private id: string;
  private pointCuts: POINT_CUT[];
  private order: number;

  constructor({
    id,
    adviceId,
    pointCuts = [],
    order = 0,
    adviceConfigs,
    beanFactory,
  }: ASPECT_ARGS) {
    this.id = id;
    this.pointCuts = pointCuts;
    const adviceBean = beanFactory.getBean(adviceId);
    this.order = order;
    const insertAdvisor = (
      adviceMethod: string,
      AdviceConstructor: AdviceCtr,
      pointCutMatcher: POINT_CUT_MATCHER,
    ) => {
      beanFactory.addAdvisor(
        new Advisor({
          advice: new AdviceConstructor({
            adviceMethod,
            advice: adviceBean,
          }),
          aspectId: id,
          ...pointCutMatcher,
        }),
      );
    };
    adviceConfigs.forEach(([position, methodName, pointCutIdOrMatcher]) => {
      let pointCutMatcher: POINT_CUT_MATCHER | undefined;
      if (typeof pointCutIdOrMatcher == 'string') {
        let pointCut = this.pointCuts.find(
          each => each.id === pointCutIdOrMatcher,
        );
        if (!pointCut) {
          pointCut = beanFactory.getPointCut(pointCutIdOrMatcher);
        }
        if (!pointCut) {
          throw new Error(`pointCutId:${pointCutIdOrMatcher}不存在`);
        }
        pointCutMatcher = pointCut;
      } else {
        pointCutMatcher = pointCutIdOrMatcher;
      }
      let Ctr: AdviceCtr;
      switch (position) {
        case 'before':
          Ctr = BeforeAdvice;
          break;
        case 'after':
          Ctr = AfterAdvice;
          break;
        case 'around':
          Ctr = AroundAdvice;
          break;
        case 'afterThrow':
          Ctr = AfterThrowAdvice;
          break;
        case 'afterReturn':
          Ctr = AfterReturnAdvice;
          break;
        default:
          throw new Error('错误连接点' + position);
      }
      insertAdvisor(methodName, Ctr, pointCutMatcher);
    });
  }

  getId() {
    return this.id;
  }

  getOrder() {
    return this.order;
  }
}
