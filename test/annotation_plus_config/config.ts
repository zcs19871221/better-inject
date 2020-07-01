import Jdbc from './jdbc';
import Context from '../../context';

export default Context.valid([
  {
    id: 'jdbc',
    alias: ['Jdbc', 'JDBC'],
    beanClass: Jdbc,
    constructParams: [
      {
        index: 0,
        value: 'jdbc',
      },
    ],
  },
]);
