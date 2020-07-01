import path from 'path';
import Context from '.';
import Dao from '../test/dao';
import Service from '../test/service';

it('context with annotation', () => {
  const context = new Context({
    scanFiles: 'test/*_r.ts',
    root: path.join(__dirname, '../'),
  });
  const dao = <Dao>context.getBean('dao');
  expect(dao.getJdbc()).toBe('SSR');
  expect((<Service>context.getBean('service')).getDao().getJdbc()).toBe('SSR');
  dao.setJdbc('oracle');
  expect((<Service>context.getBean('service')).getDao().getJdbc()).toBe(
    'oracle',
  );
});
