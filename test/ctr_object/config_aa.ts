import { Checker } from '../../context';
import Dao from './dao';

export default Checker([
  {
    id: 'dao',
    beanClass: Dao,
    constructParams: {
      0: {
        value: 'kingbase',
      },
    },
  },
]);
