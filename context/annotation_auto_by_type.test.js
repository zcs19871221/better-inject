const path = require('path');
const Context = require('../dist/context').default;
// const Dao = require('../dist/test/dao');
// const Service = require('../dist/test/service');

it('context with annotation', () => {
  const context = new Context({
    scanFiles: 'test/an_auto/*.ts',
    root: path.join(__dirname, '../'),
  });
  const obj = context.getBean('a');
  expect(obj.showB()).toBe('a invoker b:b');
});
