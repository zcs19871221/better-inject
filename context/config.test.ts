import path from 'path';
import Context from '.';
import Dao from '../test/dao';
import Service from '../test/service';
import Loginfo from '../test/loginfo';
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
  expect((<Parser>context.getBean('parser')).parse()).toBe(
    'invoke reader:xml reader',
  );
});

it('params interface use Inject', () => {
  const context = new Context({
    scanFiles: 'test/ex/*er.ts',
  });
  expect((<Parser>context.getBean('parser')).parse()).toBe(
    'invoke reader:file Reader',
  );
});

it('aop', () => {
  const context = new Context({
    configFiles: 'test/config.ts',
    aspectFiles: 'test/aspect_config.ts',
    root: path.join(__dirname, '../'),
  });
  const logInfo = <Loginfo>context.getBean('logInfo');
  const service = <Service>context.getBean('service');
  service.aopGet('good');
  expect(logInfo.getLogger()).toEqual([
    'before - args:good',
    'around - result:GOOD',
    'after',
  ]);
});
