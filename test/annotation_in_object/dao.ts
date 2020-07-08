export default class Dao {
  private name: string;
  constructor(name: string) {
    this.name = name;
  }

  getName() {
    return this.name;
  }
}
