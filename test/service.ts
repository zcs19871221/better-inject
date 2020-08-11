import Dao from './dao';
import Context from '../context';

export default class Service {
  private dao: Dao;
  private logger: any[] = [];
  constructor(dao: Dao) {
    this.dao = dao;
  }

  setLogger(logger: any[]) {
    this.logger = logger;
  }

  getDao() {
    return this.dao;
  }

  aopGet(name: string) {
    this.logger.push('invoke realmethod - args:' + name);
    return name.toUpperCase();
  }

  aopAnotherGet(name: string) {
    this.logger.push('invoke one method then invoke another - args:' + name);
    const proxy = Context.getProxy(this);
    return proxy.aopGet(name + 'another').toUpperCase();
  }

  aopDoubleGet(name: string) {
    this.logger.push('invoke realmethod - args:' + name);
    return name.toUpperCase();
  }

  aopThrow(name: string) {
    this.logger.push('invoke realmethod - args:' + name + ' throw error');
    throw new Error('mock throw');
  }

  aopDoubleThrow(name: string) {
    this.logger.push('invoke realmethod - args:' + name + ' throw error');
    throw new Error('mock throw');
  }

  aopWithAnotherAop(name: string) {
    return this.dao.aopGetJdbc(name);
  }
}
