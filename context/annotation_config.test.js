const path = require('path');
const Context = require('../dist').default;
const Dao = require('../dist/test/annotation_plus_config/dao').default;
const Service = require('../dist/test/annotation_plus_config/service').default;
const Jdbc = require('../dist/test/annotation_plus_config/jdbc').default;

it('annotation and config context', () => {
  expect(() => {
    new Context({
      scanFiles: 'test/*_r.ts',
      configFiles: 'test/config.ts',
      root: path.join(__dirname, '../'),
    });
  }).toThrow();
  const context = new Context({
    scanFiles: [
      'test/annotation_plus_config/service.ts',
      'test/annotation_plus_config/dao.ts',
    ],
    configFiles: 'test/annotation_plus_config/config.ts',
    root: path.join(__dirname, '../'),
  });
  expect(context.getBean('dao') instanceof Dao);
  expect(context.getBean('service') instanceof Service);
  expect(context.getBean('jdbc') instanceof Jdbc);
  expect(context.getBean('JDBC') instanceof Jdbc);

  expect(
    context
      .getBean('service')
      .getDao()
      .getJdbc()
      .getName(),
  ).toBe('jdbc');
});
