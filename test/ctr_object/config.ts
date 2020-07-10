import { Checker } from '../../context';
import Service from './service';
import Dao from './dao';

export default Checker([
  {
    id: 'service',
    beanClass: Service,
    constructParams: {
      0: [
        {
          dao: {
            value: 'dao',
            isBean: true,
          },
          speed: {
            value: '50',
          },
        },
      ],
    },
  },
  {
    id: 'dao',
    beanClass: Dao,
    constructParams: {
      0: {
        value: 'oracle',
      },
    },
  },
]);
