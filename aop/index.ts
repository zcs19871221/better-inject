import { Matcher, AspectOpt, JOIN_POINT } from './aspect';

interface POINT_CUT_MATCHER {
  classMatcher: Matcher | Matcher[];
  methodMatcher: Matcher | Matcher[];
}
interface POINT_CUT extends POINT_CUT_MATCHER {
  id: string;
  type: 'pointcut';
}

interface ASPECT {
  id: string;
  adviceId: any;
  pointCuts?: POINT_CUT[];
  order?: number;
  adviceConfigs: [
    typeof JOIN_POINT[number],
    {
      pointCut: string | POINT_CUT_MATCHER;
      method: string;
    },
  ][];
  type: 'aspect';
}

type AOP = POINT_CUT | ASPECT;
const checkAop = (obj: any) => {
  if (!obj) {
    throw new Error('aop配置不存在');
  }
  if (!['pointcut', 'aspect'].includes(obj.type)) {
    throw new Error('aop配置type错误');
  }
};
export { AOP, POINT_CUT, ASPECT, checkAop, JOIN_POINT, Matcher };
