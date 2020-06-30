import Dao from './dao';

export default class Service {
  private dao: Dao;
  constructor(dao: Dao) {
    this.dao = dao;
  }

  getDao() {
    return this.dao;
  }
}
