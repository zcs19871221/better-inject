import { classToId } from './class_utils';
import { ASPECT_CONFIG } from '../factory';
import { Advice_Position } from '../aop/advice';
import { POINT_CUT_MATCHER, MatcherGroup } from '../aop/point_cut';
import MetaHelper from './metaHelper';

const aspectMetaKey = Symbol('__inject Aspect');
const helper = new MetaHelper<ASPECT_CONFIG>(aspectMetaKey);

const initAspectConfig = (ctr: any): ASPECT_CONFIG => {
  const id = classToId(ctr);
  return {
    id,
    order: 0,
    adviceConfigs: [],
    adviceId: id,
    pointCuts: [],
  };
};
const Aspect = (order: number = 0) => {
  return function(ctr: any) {
    const aspectConfig = helper.get(ctr) || initAspectConfig(ctr);
    aspectConfig.order = order;
    helper.set(ctr, aspectConfig);
  };
};

const adviceAnnotationFactory = (method: typeof Advice_Position[number]) => (
  pointCut: string | POINT_CUT_MATCHER,
) => (ctr: any, methodName: string) => {
  ctr = ctr.constructor;
  const aspectConfig = helper.get(ctr) || initAspectConfig(ctr);
  aspectConfig.adviceConfigs.push([method, methodName, pointCut]);
  helper.set(ctr, aspectConfig);
};

const PointCut = (classMatcher: MatcherGroup, methodMatcher: MatcherGroup) => (
  ctr: any,
  methodName: string,
) => {
  ctr = ctr.constructor;
  const aspectConfig = helper.get(ctr) || initAspectConfig(ctr);
  aspectConfig.pointCuts?.push({
    id: methodName,
    classMatcher,
    methodMatcher,
  });
  helper.set(ctr, aspectConfig);
};

const Before = adviceAnnotationFactory('before');
const AfterReturn = adviceAnnotationFactory('afterReturn');
const After = adviceAnnotationFactory('after');
const AfterThrow = adviceAnnotationFactory('afterThrow');
const Around = adviceAnnotationFactory('around');
export {
  Aspect,
  Before,
  After,
  AfterReturn,
  AfterThrow,
  Around,
  PointCut,
  helper,
};
