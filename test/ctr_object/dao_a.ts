import { Inject, Resource } from '../../';
@Resource()
export default class Dao {
  private jdbc: string;
  constructor(@Inject('mysql', false) jdbc: string) {
    this.jdbc = jdbc;
  }

  getJdbc() {
    return this.jdbc;
  }
}
