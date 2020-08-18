import Dao from './dao_r';
import { Resource } from '..';

@Resource()
class Service {
  private dao: Dao;
  constructor(dao: Dao) {
    this.dao = dao;
  }

  getDao() {
    return this.dao;
  }
}
export default Service;
