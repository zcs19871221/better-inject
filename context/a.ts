import Context from '.';
import Service from '../test/service';
import Loginfo from '../test/loginfo';

const context = new Context({
  configFiles: 'test/config.ts',
  aspectFiles: 'test/aspect_config.ts',
});
const logger: any[] = [];
const logInfo = <Loginfo>context.getBean('logInfo');
logInfo.setLogger(logger);
const service = <Service>context.getBean('service');
service.setLogger(logger);
const result = service.aopAnotherGet('good');
logger.push(`return value - ${result}`);
console.log(logger);
