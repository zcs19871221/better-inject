import { AspectChecker } from '../context';
export default AspectChecker([
  {
    adviceId: 'logInfo',
    classMatcher: /^(dao|service)$/,
    methodMatcher: /^aop/,
    joinPoint: [
      ['before', 'logArgs'],
      ['after'],
      ['errorCatch', 'logError'],
      ['around'],
    ],
  },
  {
    adviceId: 'logInfo1',
    classMatcher: ['dao', 'service'],
    methodMatcher: /^aop/,
    joinPoint: [
      ['before', 'logArgs'],
      ['after'],
      ['errorCatch', 'logError'],
      ['around'],
    ],
  },
]);
