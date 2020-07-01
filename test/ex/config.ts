import context from '../../context';
import parser from './parser';
import fileReader from './fileReader';
import xmlReader from './xmlReader';

export default context.valid([
  {
    id: 'parser',
    beanClass: parser,
    constructParams: [
      {
        index: 0,
        isBean: true,
        value: 'xmlReader',
      },
    ],
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
