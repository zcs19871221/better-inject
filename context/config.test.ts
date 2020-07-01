import path from 'path';
import Context from '.';
import Dao from '../test/dao';
import Service from '../test/service';

it('context with config', () => {
  const context = new Context({
    configFiles: 'test/config.ts',
    root: path.join(__dirname, '../'),
  });
  const dao = <Dao>context.getBean('dao');
  expect(dao.getJdbc()).toBe('db');
  expect((<Service>context.getBean('service')).getDao().getJdbc()).toBe('db');
  dao.setJdbc('oracle');
  expect((<Service>context.getBean('service')).getDao().getJdbc()).toBe(
    'oracle',
  );
});
