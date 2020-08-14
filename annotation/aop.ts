import { JOIN_POINT, Matcher, ASPECT } from '../aop';
import { classToId } from './class_utils';
import { defineResource } from './inject';

const metaAspectKey = '__inject Aspect';

const Aspect = (
  id: string,
  {
    order = 0,
    classMatcher = [],
    methodMatcher = [],
  }: {
    order?: number;
    classMatcher?: Matcher | Matcher[];
    methodMatcher?: Matcher | Matcher[];
  } = {},
) => {
  return function(ctr: any) {
    if (!id) {
      id = classToId(ctr);
    }
    defineResource(id, 'single', '');
    const aspect: ASPECT = {
      adviceId: id,
      order,
      joinPoint: [],
      pointCut: { classMatcher, methodMatcher },
      type: 'aspect',
    };
    Reflect.defineMetadata(metaAspectKey, aspect, ctr);
  };
};

const adviceAnnotationFactory = (method: typeof JOIN_POINT[number]) => {
  (config?: {
    classMatcher: Matcher[] | Matcher[];
    methodMatcher: Matcher[] | Matcher[];
  }) => {
    (ctr: any, methodName: string) => {
      const aspect = <ASPECT>Reflect.getMetadata(metaAspectKey, ctr);
      if (!aspect) {
        throw new Error(`${method}注解必须先使用Aspect注解定义`);
      }
      aspect.joinPoint.push([method, methodName]);
      if (config) {
        aspect.pointCut = {
          classMatcher: config.classMatcher,
          methodMatcher: config.methodMatcher,
        };
      }
      Reflect.defineMetadata(metaAspectKey, aspect, ctr);
    };
  };
};
const Before = adviceAnnotationFactory('before');
const AfterReturn = adviceAnnotationFactory('afterReturn');
const After = adviceAnnotationFactory('after');
const AfterThrow = adviceAnnotationFactory('afterThrow');
const Around = adviceAnnotationFactory('around');
export { Aspect, Before, After, AfterReturn, AfterThrow, Around };
