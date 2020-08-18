import Context from '.';
import Service from '../test/service';
import Loginfo from '../test/loginfo';

const context = new Context({
  configFiles: ['test/config.ts', 'test/aop_config.ts'],
});
const logger: any[] = [];
const logInfo = <Loginfo>context.getBean('logInfo');
logInfo.setLogger(logger);
const service = <Service>context.getBean('service');
service.setLogger(logger);
const result = service.aopGet('good');
logger.push(`return value - ${result}`);
console.log(JSON.stringify(logger));
// expect(logger).toEqual([
//   'invoke around start',
//   'invoke before - originargs:good originmethod:aopGet',
//   'invoke realmethod - args:good',
//   'invoke around end',
//   'invoke after',
//   'invoke afterReturn - res:GOOD',
//   'return value - GOOD',
// ]);
