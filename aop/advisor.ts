import Advice, { ADVICE_POSITION, AdviceCtr, Advice_Position } from './advice';
import { MatcherGroup, POINT_CUT_MATCHER } from './point_cut';
import BeforeAdvice from './before_advice';
import AfterAdvice from './after_advice';
import AroundAdvice from './around_advice';
import AfterReturnAdvice from './after_return_advice';
import AfterThrowAdvice from './after_throw_advice';

export default class Advisor {
  private advice: Advice;
  private classMatcher: MatcherGroup;
  private methodMatcher: MatcherGroup;
  constructor({
    position,
    methodName,
    adviceBean,
    classMatcher,
    methodMatcher,
  }: {
    position: ADVICE_POSITION;
    methodName: string;
    adviceBean: any;
  } & POINT_CUT_MATCHER) {
    this.advice = this.createAdvice(position, methodName, adviceBean);
    this.classMatcher = classMatcher;
    this.methodMatcher = methodMatcher;
  }

  static filterByMethodAndSort(ads: Advisor[][]): Advisor[] {
    const res: {
      [pos in ADVICE_POSITION]?: Advisor[];
    }[] = [];
    ads.forEach(ad => {
      if (ad.length > 0) {
        const posObj: {
          [pos in ADVICE_POSITION]?: Advisor[];
        } = {};
        ad.forEach(each => {
          const pos = each.getAdvicePosition();
          posObj[pos] = posObj[pos] || [];
          posObj[pos]?.push(each);
        });
        res.push(posObj);
      }
    });
    return res.reduce((acc: Advisor[], cur) => {
      Advice_Position.forEach(postion => {
        const advices = cur[postion];
        if (advices !== undefined) {
          acc.push(...advices);
        }
      });
      return acc;
    }, []);
  }

  matchClass(beanId: string): boolean {
    return this.match(beanId, this.classMatcher);
  }

  matchMethod(method: string): boolean {
    return this.match(method, this.methodMatcher);
  }

  getAdvicePosition() {
    return this.advice.getPosition();
  }

  private match(target: string, matchers: MatcherGroup) {
    if (!Array.isArray(matchers)) {
      matchers = [matchers];
    }
    return matchers.some(matcher => {
      if (typeof matcher === 'string') {
        return matcher === target;
      }
      return (<RegExp>matcher).test(target);
    });
  }

  getAdvice() {
    return this.advice;
  }

  private createAdvice(
    position: ADVICE_POSITION,
    methodName: string,
    adviceBean: any,
  ) {
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
    return new Ctr({
      adviceMethod: methodName,
      advice: adviceBean,
    });
  }
}
