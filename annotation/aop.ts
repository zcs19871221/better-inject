import { classToId } from './class_utils';
import { ASPECT_CONFIG } from '../factory';
import { Advice_Position } from '../aop/advice';
import { POINT_CUT_MATCHER, MatcherGroup } from '../aop/point_cut';

const metaAspectKey = '__inject Aspect';

const Aspect = (order: number = 0) => {
  return function (ctr: any) {
    const id = classToId(ctr);
    const aspectConfig: ASPECT_CONFIG = {
      id,
      order,
      adviceConfigs: [],
      adviceId: '',
      pointCuts: [],
    };
    Reflect.defineMetadata(metaAspectKey, aspectConfig, ctr);
  };
};

const adviceAnnotationFactory = (method: typeof Advice_Position[number]) => {
  (pointCut: string | POINT_CUT_MATCHER) => {
    (ctr: any, methodName: string) => {
      const aspect_config = <ASPECT_CONFIG>(
        Reflect.getMetadata(metaAspectKey, ctr)
      );
      if (!aspect_config) {
        throw new Error(`${method}注解必须先使用Aspect注解定义`);
      }
      aspect_config.adviceConfigs.push([method, methodName, pointCut]);
      Reflect.defineMetadata(metaAspectKey, aspect_config, ctr);
    };
  };
};

const PointCut = (classMatcher: MatcherGroup, methodMatcher: MatcherGroup) => (
  ctr: any,
  methodName: string,
) => {
  const aspect_config = <ASPECT_CONFIG>Reflect.getMetadata(metaAspectKey, ctr);
  if (!aspect_config) {
    throw new Error('必须使用Aspect注解定义类才能使用PointCut注解');
  }
  aspect_config.pointCuts?.push({
    id: methodName,
    classMatcher,
    methodMatcher,
  });
  Reflect.defineMetadata(metaAspectKey, aspect_config, ctr);
};

const Before = adviceAnnotationFactory('before');
const AfterReturn = adviceAnnotationFactory('afterReturn');
const After = adviceAnnotationFactory('after');
const AfterThrow = adviceAnnotationFactory('afterThrow');
const Around = adviceAnnotationFactory('around');
export { Aspect, Before, After, AfterReturn, AfterThrow, Around, PointCut };
