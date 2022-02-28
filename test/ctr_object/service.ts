import Dao from './dao';

class Service {
  private dao: Dao;
  private speed: string;
  private id: string;
  constructor({ dao, speed, id }: { dao: Dao; speed: string; id: string }) {
    this.dao = dao;
    this.speed = speed;
    this.id = id;
  }

  getAll() {
    return `${this.dao.getJdbc()} ${this.speed} ${this.id}`;
  }
}
export default Service;
