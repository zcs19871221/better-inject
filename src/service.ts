import Dao from './dao';

export default class Service {
  private dao: Dao;
  constructor(dao: Dao) {
    this.dao = dao;
  }

  do() {
    console.log('链接jdbc' + this.dao.getJdbc() + '执行service');
  }
}
