import Jdbc from './jdbc';
import { Checker } from '../..';

export default Checker([
  {
    id: 'jdbc',
    alias: ['Jdbc', 'JDBC'],
    beanClass: Jdbc,
    constructParams: {
      0: {
        value: 'jdbc',
      },
    },
  },
]);
