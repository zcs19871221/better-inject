import Context from './Context';
import Dao from '../test/dao';
import Service from '../test/service';

it('context', () => {
  const context = new Context('test/config.ts');
  expect((<Dao>context.getBean('dao')).getJdbc()).toBe('db');
  expect((<Service>context.getBean('service')).getDao().getJdbc()).toBe('db');
});
