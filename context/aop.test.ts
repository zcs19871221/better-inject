import path from 'path';
import Context from '.';
import Service from '../test/service';
import Loginfo from '../test/loginfo';

it('aop single', () => {
  const context = new Context({
    configFiles: 'test/config.ts',
    aspectFiles: 'test/aspect_config.ts',
    root: path.join(__dirname, '../'),
  });
  const logger: any[] = [];
  const logInfo = <Loginfo>context.getBean('logInfo');
  logInfo.setLogger(logger);
  const service = <Service>context.getBean('service');
  service.setLogger(logger);
  const result = service.aopGet('good');
  logger.push(`return value - ${result}`);
  expect(logger).toEqual([
    'invoke around start',
    'invoke before - originargs:good originmethod:aopGet',
    'invoke realmethod - args:good',
    'invoke around end',
    'invoke after',
    'invoke afterReturn - res:GOOD',
    'return value - GOOD',
  ]);
});

it('origin invoke another aop', () => {
  const context = new Context({
    configFiles: 'test/config.ts',
    aspectFiles: 'test/aspect_config.ts',
    root: path.join(__dirname, '../'),
  });
  const logger: any[] = [];
  const logInfo = <Loginfo>context.getBean('logInfo');
  logInfo.setLogger(logger);
  const service = <Service>context.getBean('service');
  service.setLogger(logger);
  const result = service.aopAnotherGet('good');
  logger.push(`return value - ${result}`);
  expect(logger).toEqual([
    'invoke around start',
    'invoke before - originargs:good originmethod:aopAnotherGet',
    'invoke one method then invoke another - args:',
    'invoke around start',
    'invoke before - originargs:goodanother originmethod:aopGet',
    'invoke realmethod - args:goodanother',
    'invoke around end',
    'invoke after',
    'invoke afterReturn - res:GOODANOTHER',
    'invoke around end',
    'invoke after',
    'invoke afterReturn - res:goodanother',
    'return value - goodanother',
  ]);
});

it('aop single throw', () => {
  const context = new Context({
    configFiles: 'test/config.ts',
    aspectFiles: 'test/aspect_config.ts',
    root: path.join(__dirname, '../'),
  });
  const logger: any[] = [];
  const logInfo = <Loginfo>context.getBean('logInfo');
  logInfo.setLogger(logger);
  const service = <Service>context.getBean('service');
  service.setLogger(logger);
  expect(() => service.aopThrow('bad')).toThrow('mock throw');
  expect(logger).toEqual([
    'invoke around start',
    'invoke before - originargs:bad originmethod:aopThrow',
    'invoke realmethod - args:bad throw error',
    'invoke after',
    'invoke afterThrow - errorMsg:mock throw',
  ]);
});

it('aop double', () => {
  const context = new Context({
    configFiles: 'test/config.ts',
    aspectFiles: 'test/aspect_config.ts',
    root: path.join(__dirname, '../'),
  });
  const logger: any[] = [];
  const logInfo = <Loginfo>context.getBean('logInfo');
  logInfo.setLogger(logger);
  const logInfo1 = <Loginfo>context.getBean('logInfo1');
  logInfo1.setLogger(logger);
  const service = <Service>context.getBean('service');
  service.setLogger(logger);
  const result = service.aopDoubleGet('good');
  logger.push(`return value - ${result}`);
  expect(logger).toEqual([
    'invoke around start',
    'invoke before - originargs:good originmethod:aopDoubleGet',
    'invoke around1 start',
    'invoke before1 - originargs:good originmethod:aopDoubleGet',
    'invoke realmethod - args:good',
    'invoke around1 end',
    'invoke after1',
    'invoke afterReturn1 - res:GOOD',
    'invoke around end',
    'invoke after',
    'invoke afterReturn - res:GOOD',
    'return value - GOOD',
  ]);
});

it('aop double with order desc', () => {
  const context = new Context({
    configFiles: 'test/config.ts',
    aspectFiles: 'test/aspect_config_order.ts',
    root: path.join(__dirname, '../'),
  });
  const logger: any[] = [];
  const logInfo = <Loginfo>context.getBean('logInfo');
  logInfo.setLogger(logger);
  const logInfo1 = <Loginfo>context.getBean('logInfo1');
  logInfo1.setLogger(logger);
  const service = <Service>context.getBean('service');
  service.setLogger(logger);
  const result = service.aopDoubleGet('good');
  logger.push(`return value - ${result}`);
  expect(logger).toEqual([
    'invoke around1 start',
    'invoke before1 - originargs:good originmethod:aopDoubleGet',
    'invoke around start',
    'invoke before - originargs:good originmethod:aopDoubleGet',
    'invoke realmethod - args:good',
    'invoke around end',
    'invoke after',
    'invoke afterReturn - res:GOOD',
    'invoke around1 end',
    'invoke after1',
    'invoke afterReturn1 - res:GOOD',
    'return value - GOOD',
  ]);
});

it('aop double throw', () => {
  const context = new Context({
    configFiles: 'test/config.ts',
    aspectFiles: 'test/aspect_config.ts',
    root: path.join(__dirname, '../'),
  });
  const logger: any[] = [];
  const logInfo = <Loginfo>context.getBean('logInfo');
  logInfo.setLogger(logger);
  const logInfo1 = <Loginfo>context.getBean('logInfo1');
  logInfo1.setLogger(logger);
  const service = <Service>context.getBean('service');
  service.setLogger(logger);
  expect(() => service.aopDoubleThrow('bad')).toThrow('mock throw');
  expect(logger).toEqual([
    'invoke around start',
    'invoke before - originargs:bad originmethod:aopDoubleThrow',
    'invoke around1 start',
    'invoke before1 - originargs:bad originmethod:aopDoubleThrow',
    'invoke realmethod - args:bad throw error',
    'invoke after1',
    'invoke afterThrow1 - errorMsg:mock throw',
    'invoke after',
    'invoke afterThrow - errorMsg:mock throw',
  ]);
});
