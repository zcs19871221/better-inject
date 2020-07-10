import Context from '../../';

const context = new Context({
  scanFiles: 'test/ctr_object/*_a.ts',
});
const service = <any>context.getBean('service', {
  speed: 80,
});
console.log(service.getAll());
