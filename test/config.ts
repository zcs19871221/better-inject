import Dao from './dao';
import Service from './service';
import { Checker } from '../context';

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
  },
]);
