import Dao from './dao';

export default class Service {
  private dao: Dao;
  constructor(dao: Dao) {
    this.dao = dao;
  }

  getDao() {
    return this.dao;
  }

  aopGet(name: string) {
    return name.toUpperCase();
  }

  aopWithAnotherAop(name: string) {
    return this.dao.aopGetJdbc(name);
  }
}
