import { AspectChecker } from '../context';
export default AspectChecker({
  adviceId: 'logInfo',
  classMatcher: /^(dao|service)$/,
  methodMatcher: /^aop/,
  joinPoint: [
    ['before', 'logArgs'],
    ['after'],
    ['errorCatch', 'logError'],
    ['around'],
  ],
});
