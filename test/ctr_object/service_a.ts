import Dao from './dao_aa';
import { InjectObj, Resource } from '../../';

@Resource()
class Service {
  private dao: Dao;
  private speed: string;
  private id: string;
  constructor(
    @InjectObj({
      dao: {
        isBean: true,
        value: 'dao',
      },
      id: {
        value: 'annotaionId',
      },
    })
    { dao, speed, id }: { dao: Dao; speed: string; id: string },
  ) {
    this.dao = dao;
    this.speed = speed;
    this.id = id;
  }

  getAll() {
    return `${this.dao.getJdbc()} ${this.speed} ${this.id}`;
  }
}
export default Service;
