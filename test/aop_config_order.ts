import Dao from './dao';
import Service from './service';
import LogInfo from './loginfo';
import LogInfo1 from './loginfo1';
import { Checker } from '..';

export default Checker([
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
    id: 'orderAspect1',
    type: 'aspect',
    adviceId: 'logInfo',
    adviceConfigs: [
      ['around', 'around', 'p1'],
      ['before', 'logArgs', 'p1'],
      ['after', 'after', 'p1'],
      ['afterThrow', 'logError', 'p1'],
      ['afterReturn', 'logResult', 'p1'],
    ],
    order: 1,
  },
  {
    id: 'orderAspect2',
    adviceId: 'logInfo1',
    type: 'aspect',
    adviceConfigs: [
      ['around', 'around', 'p2'],
      ['before', 'logArgs', 'p2'],
      ['after', 'after', 'p2'],
      ['afterThrow', 'logError', 'p2'],
      ['afterReturn', 'logResult', 'p2'],
    ],
    order: 0,
  },
  {
    id: 'dao',
    alias: ['Dao', 'do', 'ao'],
    beanClass: Dao,
    constructParams: {
      0: {
        value: 'db',
      },
    },
    type: 'single',
  },
  {
    id: 'service',
    beanClass: Service,
    constructParams: {
      0: {
        value: 'dao',
        isBean: true,
      },
    },
    exposeProxy: true,
  },
  {
    id: 'logInfo',
    beanClass: LogInfo,
    type: 'single',
  },
  {
    id: 'logInfo1',
    beanClass: LogInfo1,
    type: 'single',
  },
]);
