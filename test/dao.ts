export default class Dao {
  private jdbc: string;
  constructor(jdbc: string) {
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
