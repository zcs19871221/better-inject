import path from 'path';
import Context from '.';
import Service from '../test/ctr_object/service';

it('construct object with config', () => {
  const context = new Context({
    configFiles: 'test/ctr_object/config.ts',
    root: path.join(__dirname, '../'),
  });
  const service = <Service>context.getBean('service', {
    id: 'dynamicId',
  });
  expect(service.getAll()).toBe(`oracle 50 dynamicId`);
});

it('construct object with annotation', () => {
  const context = new Context({
    scanFiles: 'test/ctr_object/*_a.ts',
    root: path.join(__dirname, '../'),
  });
  const service = <Service>context.getBean('service', {
    speed: 80,
  });
  expect(service.getAll()).toBe(`mysql 80 annotaionId`);
});

it('construct object with annotation and config', () => {
  const context = new Context({
    scanFiles: 'test/ctr_object/service_aa.ts',
    configFiles: 'test/ctr_object/config_aa.ts',
    root: path.join(__dirname, '../'),
  });
  const service = <Service>context.getBean('service', {
    speed: 30,
    id: 'overwriteId',
  });
  expect(service.getAll()).toBe(`kingbase 30 overwriteId`);
});
