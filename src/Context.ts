import { parse } from 'querystring';
import { FactoryBean } from './bean_factory';

class Context {
  constructor(configFiles: string | string[]) {
    parse();
    get();
    FactoryBean.regist();
  }

  getBean() {}
}
