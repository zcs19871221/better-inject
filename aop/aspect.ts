import POINT_CUT, { POINT_CUT_MATCHER } from './point_cut';
import Advisor from './advisor';
import { ADVICE_POSITION } from '../aop/advice';

interface ASPECT_ARGS {
  id: string;
  pointCuts?: POINT_CUT[];
  globalPointCuts: Map<string, POINT_CUT>;
  order?: number;
  advice: any;
  adviceConfigs: [ADVICE_POSITION, string, string | POINT_CUT_MATCHER][];
}

export { ASPECT_ARGS };
export default class Aspect {
  private id: string;
  private pointCuts: POINT_CUT[];
  private order: number;
  private advisors: Advisor[] = [];
  constructor({
    id,
    pointCuts = [],
    order = 0,
    advice,
    adviceConfigs,
    globalPointCuts,
  }: ASPECT_ARGS) {
    this.id = id;
    this.pointCuts = pointCuts;
    this.order = order;
    this.registAdvisor(advice, adviceConfigs, globalPointCuts);
  }

  getId() {
    return this.id;
  }

  getOrder() {
    return this.order;
  }

  static filterAndOrderByClass(
    beanId: string,
    aspects: IterableIterator<Aspect>,
  ): Advisor[] {
    const toSort: {
      [key: number]: Advisor[];
    } = {};
    for (const aspect of aspects) {
      const ads = aspect.advisors.filter(each => each.matchClass(beanId));
      const order = aspect.getOrder();
      if (ads.length > 0) {
        toSort[order] = toSort[order] || [];
        toSort[order].push(...ads);
      }
    }
    const ordered = Object.keys(toSort).sort((a, b) => Number(a) - Number(b));
    return Advisor.filterByMethodAndSort(
      ordered.map((key: any) => toSort[key]),
    );
  }

  filterByMethod(method: string): Advisor[] {
    return this.advisors.filter(each => each.matchMethod(method));
  }

  private registAdvisor(
    adviceBean: any,
    adviceConfigs: ASPECT_ARGS['adviceConfigs'],
    globalPointCuts: Map<string, POINT_CUT>,
  ) {
    adviceConfigs.forEach(([position, methodName, pointCutIdOrMatcher]) => {
      const pointCutMatcher: POINT_CUT_MATCHER = this.findPointCutMatcher(
        pointCutIdOrMatcher,
        globalPointCuts,
      );
      this.advisors.push(
        new Advisor({
          position,
          methodName,
          adviceBean,
          ...pointCutMatcher,
        }),
      );
    });
  }

  private findPointCutMatcher(
    pointCutIdOrMatcher: string | POINT_CUT_MATCHER,
    globalPointCuts: Map<string, POINT_CUT>,
  ) {
    let pointCutMatcher: POINT_CUT_MATCHER;
    if (typeof pointCutIdOrMatcher == 'string') {
      let pointCut = this.pointCuts.find(
        each => each.id === pointCutIdOrMatcher,
      );
      if (!pointCut) {
        pointCut = globalPointCuts.get(pointCutIdOrMatcher);
      }
      if (!pointCut) {
        throw new Error(`pointCutId:${pointCutIdOrMatcher}不存在`);
      }
      pointCutMatcher = pointCut;
    } else {
      pointCutMatcher = pointCutIdOrMatcher;
    }
    return pointCutMatcher;
  }
}
