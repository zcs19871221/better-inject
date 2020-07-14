import Context from '.';
import factoryBean from '../test/factory_bean';

it('context with config', () => {
  const context = new Context({});
  context.regist({
    id: 'factoryBean',
    beanClass: factoryBean,
    constructParams: {
      0: {
        value: '张三',
      },
    },
  });
  expect((<any>context.getBean('factoryBean')).getName()).toBe('张三');
  expect((<any>context.getBean('&factoryBean')).getFacoryName()).toBe(
    'factory张三',
  );
});
