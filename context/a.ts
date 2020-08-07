import Context from '.';
import Service from '../test/service';
// import Loginfo from '../test/loginfo';

const context = new Context({
  configFiles: 'test/config.ts',
  aspectFiles: 'test/aspect_config.ts',
});
// const logInfo = <Loginfo>context.getBean('logInfo');
const service = <Service>context.getBean('service');
const result = service.aopGet('good');
console.log(result);
// console.log(logInfo.getLogger());
// console.log(['before - args:good', 'around - result:GOOD', 'after']);
