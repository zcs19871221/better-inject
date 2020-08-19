import Context from '../';

const context = new Context({
  scanFiles: 'test/aop_an/*.ts',
  configFiles: 'test/aop_an/config.ts',
});
const logger: any[] = [];
const asp1: any = context.getBean('testaspect');
const asp2: any = context.getBean('testaspect2');
asp1.setLogger(logger);
asp2.setLogger(logger);
const c1: any = context.getBean('c1');
c1.getName('name is ');
console.log(JSON.stringify(logger));
