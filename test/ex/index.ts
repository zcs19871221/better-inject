import Context from '../../context';

const context = new Context({
  configFiles: 'test/ex/config.ts',
});

console.log((<any>context.getBean('parser')).parse());
