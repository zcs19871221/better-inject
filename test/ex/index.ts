import Context from '../../context';

const context = new Context({
  scanFiles: 'test/ex/*er.ts',
});
console.log((<any>context.getBean('parser')).parse());
