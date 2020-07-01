import path from 'path';
import Context from '.';
import Dao from '../test/dao';
import Service from '../test/service';
import Parser from '../test/ex/parser';

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

it('params interface', () => {
  const context = new Context({
    configFiles: 'test/ex/config.ts',
  });
  console.log(process.cwd());
  expect((<Parser>context.getBean('parser')).parse()).toBe(
    'invoke reader:xml reader',
  );
});
