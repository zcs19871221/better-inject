import { Resource } from '../context/annotation';

@Resource()
export default class Dao {
  private jdbc: string;
  constructor(jdbc: string = 'SSR') {
    this.jdbc = jdbc;
    '';
  }

  getJdbc() {
    return this.jdbc;
  }

  setJdbc(jdbc: string) {
    this.jdbc = jdbc;
  }
}
