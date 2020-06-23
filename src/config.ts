import Context from './Context';
import Dao from './Dao';
import Service from './Service';
Context.regist({
  id: 'dao',
  beanClass: Dao,
  properties: 'jdbc://oracle',
  type: 'single',
});
Context.regist({
  id: 'service',
  beanClass: Service,
  properties: 'REF_dao',
});
const obj = <Service>Context.get().getBean('service');
obj.do();
