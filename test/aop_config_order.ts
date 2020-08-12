import { AopChecker } from '../context';
export default AopChecker([
  {
    type: 'pointcut',
    classMatcher: /^(dao|service)$/,
    methodMatcher: /^aop/,
    id: 'p1',
  },
  {
    type: 'pointcut',
    classMatcher: ['dao', 'service'],
    methodMatcher: /^aopDouble/,
    id: 'p2',
  },
  {
    type: 'aspect',
    adviceId: 'logInfo',
    pointCutId: 'p1',
    joinPoint: [
      ['around'],
      ['before', 'logArgs'],
      ['after'],
      ['afterThrow', 'logError'],
      ['afterReturn', 'logResult'],
    ],
    order: 0,
  },
  {
    adviceId: 'logInfo1',
    type: 'aspect',
    pointCutId: 'p2',
    joinPoint: [
      ['around'],
      ['before', 'logArgs'],
      ['after'],
      ['afterThrow', 'logError'],
      ['afterReturn', 'logResult'],
    ],
    order: 1,
  },
]);
