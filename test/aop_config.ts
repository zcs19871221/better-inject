import { Checker } from '../context';
export default Checker([
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
  },
  {
    type: 'aspect',
    adviceId: 'logInfo1',
    pointCutId: 'p2',
    joinPoint: [
      ['around'],
      ['before', 'logArgs'],
      ['after'],
      ['afterThrow', 'logError'],
      ['afterReturn', 'logResult'],
    ],
  },
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
]);
