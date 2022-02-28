export default class User {
  name: string = '';
  id: string = '';
  alias: string = '';
  constructor(id: string, name: string, alias: string) {
    this.name = name;
    this.id = id;
    this.alias = alias;
  }
}
