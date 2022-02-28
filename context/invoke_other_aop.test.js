const path = require('path');
const Context = require('../dist/context').default;

it('origin invoke another aop', () => {
  const context = new Context({
    configFiles: ['test/aop_config.ts'],
    root: path.join(__dirname, '../'),
  });
  const logger = [];
  const logInfo = context.getBean('logInfo');
  logInfo.setLogger(logger);
  const service = context.getBean('service');
  service.setLogger(logger);
  const result = service.aopAnotherGet('good');
  logger.push(`return value - ${result}`);
  expect(logger).toEqual([
    'invoke around start',
    'invoke before - originargs:good originmethod:aopAnotherGet',
    'invoke one method then invoke another - args:good',
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
