import Dao from './dao_R';
import { Resource } from '../context/annotation';

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
