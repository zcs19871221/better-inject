import BeanFactory from './bean_factory';
import BeanDefinition from '../definition/bean_definition';
import Dao from '../test/dao';
import Service from '../test/service';
import A from '../test/A';
import B from '../test/B';

it('regist', () => {
  const f = new BeanFactory();
  f.registDefination(
    new BeanDefinition({
      id: 'dao',
      alias: ['Dao', 'do', 'ao'],
      beanClass: Dao,
      properties: 'oracle',
      type: 'single',
    }),
  );
  expect((<Dao>f.getBean('Dao')).getJdbc()).toBe('oracle');
  expect(() => {
    f.registDefination(
      new BeanDefinition({
        id: 'dao',
        beanClass: Dao,
        properties: 'oracle',
        type: 'single',
      }),
    );
  }).toThrow();
  expect(() => {
    f.registDefination(
      new BeanDefinition({
        id: 'ffff',
        alias: ['Dao'],
        beanClass: Dao,
        properties: 'oracle',
        type: 'single',
      }),
    );
  }).toThrow();
});

it('inner single', () => {
  const f = new BeanFactory();
  f.registDefination(
    new BeanDefinition({
      id: 'dao',
      beanClass: Dao,
      properties: 'oracle',
      type: 'single',
    }),
  );
  f.registDefination(
    new BeanDefinition({
      id: 'service',
      beanClass: Service,
      properties: 'ID:dao',
    }),
  );
  const service = <Service>f.getBean('service');
  const dao = <Dao>f.getBean('dao');
  expect(service.getDao().getJdbc()).toBe('oracle');
  expect(dao.getJdbc()).toBe('oracle');
  dao.setJdbc('mysql');
  expect(service.getDao().getJdbc()).toBe('mysql');
  expect(dao.getJdbc()).toBe('mysql');
  expect((<Dao>f.getBean('dao')).getJdbc()).toBe('mysql');
  expect((<Service>f.getBean('service')).getDao().getJdbc()).toBe('mysql');
});

it('all prototype', () => {
  const f = new BeanFactory();
  f.registDefination(
    new BeanDefinition({
      id: 'dao',
      beanClass: Dao,
      properties: 'oracle',
    }),
  );
  f.registDefination(
    new BeanDefinition({
      id: 'service',
      beanClass: Service,
      properties: 'ID:dao',
    }),
  );
  const service = <Service>f.getBean('service');
  const dao = <Dao>f.getBean('dao');
  expect(service.getDao().getJdbc()).toBe('oracle');
  expect(dao.getJdbc()).toBe('oracle');
  dao.setJdbc('mysql');
  expect(service.getDao().getJdbc()).toBe('oracle');
  expect(dao.getJdbc()).toBe('mysql');
  expect((<Dao>f.getBean('dao')).getJdbc()).toBe('oracle');
  expect((<Service>f.getBean('service')).getDao().getJdbc()).toBe('oracle');
});

it('circule depend', () => {
  const f = new BeanFactory();
  f.registDefination(
    new BeanDefinition({
      id: 'a',
      beanClass: A,
      properties: 'ID:b',
    }),
  );
  f.registDefination(
    new BeanDefinition({
      id: 'b',
      beanClass: B,
      properties: 'ID:a',
    }),
  );

  expect(() => f.getBean('a')).toThrow(new Error('循环引用:a'));
});
