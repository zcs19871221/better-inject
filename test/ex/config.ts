import { Checker } from '../../context';
import parser from './parser';
import fileReader from './fileReader';
import xmlReader from './xmlReader';

export default Checker([
  {
    id: 'parser',
    beanClass: parser,
    constructParams: {
      0: {
        isBean: true,
        value: 'xmlReader',
      },
    },
  },
  {
    id: 'fileReader',
    beanClass: fileReader,
  },
  {
    id: 'xmlReader',
    beanClass: xmlReader,
  },
]);
