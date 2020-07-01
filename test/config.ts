import Dao from './dao';
import Service from './service';
import Context from '../context';

export default Context.valid([
  {
    id: 'dao',
    alias: ['Dao', 'do', 'ao'],
    beanClass: Dao,
    constructParams: [
      {
        index: 0,
        value: 'db',
      },
    ],
    type: 'single',
  },
  {
    id: 'service',
    beanClass: Service,
    constructParams: [
      {
        index: 0,
        value: 'dao',
        isBean: true,
      },
    ],
  },
]);
