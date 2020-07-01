import Dao from './dao';
import { Resource } from '../../context';

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
