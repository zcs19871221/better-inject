import { AspectChecker } from '../context';
export default AspectChecker([
  {
    adviceId: 'logInfo',
    classMatcher: /^(dao|service)$/,
    methodMatcher: /^aop/,
    joinPoint: [
      ['around'],
      ['before', 'logArgs'],
      ['after'],
      ['afterThrow', 'logError'],
      ['afterReturn', 'logResult'],
    ],
  },
  {
    adviceId: 'logInfo1',
    classMatcher: ['dao', 'service'],
    methodMatcher: /^aopDouble/,
    joinPoint: [
      ['around'],
      ['before', 'logArgs'],
      ['after'],
      ['afterThrow', 'logError'],
      ['afterReturn', 'logResult'],
    ],
  },
]);
