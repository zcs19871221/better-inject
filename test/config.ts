import Dao from './dao';
import Service from './service';

export default [
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
];
