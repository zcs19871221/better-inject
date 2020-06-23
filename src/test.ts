import BeanFactory from './bean_factory';
import BeanDefinition from './bean_definition';
import Dao from './dao';
import Service from './service';

const f = new BeanFactory();

f.registDefination(
  new BeanDefinition({
    id: 'dao',
    beanClass: Dao,
    properties: 'jdbc://oracle',
    type: 'single',
  }),
);
f.registDefination(
  new BeanDefinition({
    id: 'service',
    beanClass: Service,
    properties: 'REF_dao',
  }),
);
const obj = <Service>f.getBean('service');
obj.do();
