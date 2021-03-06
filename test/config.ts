import Dao from './dao';
import Service from './service';
import LogInfo from './loginfo';
import LogInfo1 from './loginfo1';
import { Checker } from '../';

export default Checker([
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
