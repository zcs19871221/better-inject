const path = require('path');
const Context = require('../dist/context').default;

// it('aop annotation ', () => {
const contextx = new Context({
  scanFiles: 'test/aop_an/*.ts',
  root: path.join(__dirname, '../'),
});
const aspx = contextx.getBean('testaspect');

const c1x = contextx.getBean('c1');
c1x.getName('name is ');
console.log(aspx.getLogger());
// const logger = [];
// asp.setLogger(logger);
//   expect(() => c1.getError('may error')).toThrow('throw error');
//   expect(logger).toEqual([
//     'around start',
//     'before:may error',
//     'after',
//     'catched error:throw error',
//   ]);
// });
// it('aop annotation and config', () => {
const context = new Context({
  scanFiles: 'test/aop_an/*.ts',
  configFiles: 'test/aop_an/config.ts',
  root: path.join(__dirname, '../'),
});
const logger = [];
const asp1 = context.getBean('testaspect');
const asp2 = context.getBean('testaspect2');
asp1.setLogger(logger);
asp2.setLogger(logger);
const c1 = context.getBean('c1');
c1.getName('name is ');
console.log(logger);
//   expect(logger).toEqual([
//     'around2 start',
//     'around start',
//     'before2:name is ',
//     'before:name is ',
//     'around2 end',
//     'around end',
//     'after2',
//     'after',
//     'return2 res:name is fuck',
//     'return res:name is fuck',
//   ]);
// });
