const path = require('path');
const Context = require('../dist/context').default;
// const Dao = require('../dist/test/dao');
// const Service = require('../dist/test/service');

it('context with annotation', () => {
  const context = new Context({
    scanFiles: 'test/*_r.ts',
    root: path.join(__dirname, '../'),
  });
  const dao = context.getBean('dao');
  expect(dao.getJdbc()).toBe('SSR');
  expect(
    context
      .getBean('service')
      .getDao()
      .getJdbc(),
  ).toBe('SSR');
  dao.setJdbc('oracle');
  expect(
    context
      .getBean('service')
      .getDao()
      .getJdbc(),
  ).toBe('oracle');
});
