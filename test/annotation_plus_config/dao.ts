import { Resource } from '../../context';
import Jdbc from './jdbc';

@Resource({ type: 'single' })
export default class Dao {
  private jdbc: Jdbc;
  constructor(jdbc: Jdbc) {
    this.jdbc = jdbc;
  }

  getJdbc() {
    return this.jdbc;
  }
}
