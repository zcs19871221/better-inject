const path = require('path');
const Context = require('../dist/context').default;
// const Dao = require('../test/dao');
// const Service = require('../test/service');
// // const Loginfo = require('../test/loginfo');
// const Parser = require('../test/ex/parser');

it('context with config', () => {
  const context = new Context({
    configFiles: 'test/config.ts',
    root: path.join(__dirname, '../'),
  });
  const dao = context.getBean('dao');
  expect(dao.getJdbc()).toBe('db');
  expect(
    context
      .getBean('service')
      .getDao()
      .getJdbc(),
  ).toBe('db');
  dao.setJdbc('oracle');
  expect(
    context
      .getBean('service')
      .getDao()
      .getJdbc(),
  ).toBe('oracle');
});

it('params interface', () => {
  const context = new Context({
    configFiles: 'test/ex/config.ts',
    root: path.join(__dirname, '../'),
  });
  expect(context.getBean('parser').parse()).toBe('invoke reader:xml reader');
});

it('params interface use Inject', () => {
  const context = new Context({
    scanFiles: 'test/ex/*er.ts',
    root: path.join(__dirname, '../'),
  });
  expect(context.getBean('parser').parse()).toBe('invoke reader:file Reader');
});
