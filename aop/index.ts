import { Matcher, AspectOpt } from './aspect';

interface POINT_CUT {
  id: string;
  type: 'pointcut';
  classMatcher: Matcher | Matcher[];
  methodMatcher: Matcher | Matcher[];
}

type ASPECT = Pick<AspectOpt, 'order' | 'joinPoint'> & {
  pointCutId: string;
  type: 'aspect';
  adviceId: string;
};

type AOP = POINT_CUT | ASPECT;
const checkAop = (obj: any) => {
  if (!obj) {
    throw new Error('aop配置不存在');
  }
  if (!['pointcut', 'aspect'].includes(obj.type)) {
    throw new Error('aop配置type错误');
  }
};
export { AOP, POINT_CUT, ASPECT, checkAop };
