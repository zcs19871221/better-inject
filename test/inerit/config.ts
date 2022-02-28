import { Checker } from '../../';
import Base from './base';
import Sub1 from './sub1';
import Sub2 from './sub2';

export default Checker([
  {
    id: 'base',
    constructParams: {
      0: [
        {
          name: { value: '张三' },
          gender: { value: '男' },
        },
      ],
    },
    beanClass: Base,
  },
  {
    id: 'sub1',
    constructParams: {
      0: [
        {
          food: { value: 'burger' },
        },
      ],
    },
    beanClass: Sub1,
    parent: 'base',
  },
  {
    id: 'sub2',
    constructParams: {
      0: [
        {
          drink: { value: 'coke cola' },
        },
      ],
    },
    beanClass: Sub2,
    parent: 'base',
  },
]);
