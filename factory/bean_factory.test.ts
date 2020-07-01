import BeanFactory from '.';
import BeanDefinition from '../definition';
import Dao from '../test/dao';
import Service from '../test/service';
import A from '../test/A';
import B from '../test/B';
import FactoryBean, { Person } from '../test/factoryBean';

it('regist', () => {
  const f = new BeanFactory();
  f.registDefination(
    new BeanDefinition({
      id: 'dao',
      alias: ['Dao', 'do', 'ao'],
      beanClass: Dao,
      constructParams: [
        {
          index: 0,
          value: 'oracle',
          isBean: false,
        },
      ],
      type: 'single',
    }),
  );
  expect((<Dao>f.getBean('Dao')).getJdbc()).toBe('oracle');
  expect(() => {
    f.registDefination(
      new BeanDefinition({
        id: 'dao',
        beanClass: Dao,
        constructParams: [
          {
            index: 0,
            value: 'oracle',
            isBean: false,
          },
        ],
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
        constructParams: [
          {
            index: 0,
            value: 'oracle',
            isBean: false,
          },
        ],
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
      constructParams: [
        {
          index: 0,
          value: 'oracle',
          isBean: false,
        },
      ],
      type: 'single',
    }),
  );
  f.registDefination(
    new BeanDefinition({
      id: 'service',
      beanClass: Service,
      constructParams: [
        {
          index: 0,
          value: 'dao',
          isBean: true,
        },
      ],
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
      constructParams: [
        {
          index: 0,
          value: 'oracle',
          isBean: false,
        },
      ],
    }),
  );
  f.registDefination(
    new BeanDefinition({
      id: 'service',
      beanClass: Service,
      constructParams: [
        {
          index: 0,
          value: 'dao',
          isBean: true,
        },
      ],
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
      constructParams: [
        {
          index: 0,
          value: 'b',
          isBean: true,
        },
      ],
    }),
  );
  f.registDefination(
    new BeanDefinition({
      id: 'b',
      beanClass: B,
      constructParams: [
        {
          index: 0,
          value: 'a',
          isBean: true,
        },
      ],
    }),
  );

  expect(() => f.getBean('a')).toThrow(new Error('循环引用:a'));
});

it('args', () => {
  const f = new BeanFactory();
  f.registDefination(
    new BeanDefinition({
      id: 'dao',
      beanClass: Dao,
      constructParams: [
        {
          index: 0,
          value: 'oracle',
          isBean: false,
        },
      ],
    }),
  );
  expect((<Dao>f.getBean('dao', 'inputArgs')).getJdbc()).toBe('inputArgs');
});

it('factoryBean', () => {
  const f = new BeanFactory();
  f.registDefination(
    new BeanDefinition({
      id: 'factoryBean',
      beanClass: FactoryBean,
      constructParams: [
        {
          index: 0,
          value: 'zcs',
        },
      ],
    }),
  );
  f.registDefination(
    new BeanDefinition({
      id: 'factoryBeanSingle',
      beanClass: FactoryBean,
      constructParams: [
        {
          index: 0,
          value: 'zcs',
        },
      ],
      type: 'single',
    }),
  );
  expect(<any>f.getBean('factoryBean')).toEqual(new Person('zcs'));
  expect(<any>f.getBean('factoryBean', 'sln')).toEqual(new Person('sln'));

  const bean = <any>f.getBean('factoryBeanSingle');
  expect(bean).toEqual(new Person('zcs'));
  expect(<any>f.getBean('factoryBeanSingle')).toBe(bean);
});
