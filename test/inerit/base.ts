export default class Base {
  private name: string;
  private gender: string;
  constructor({ name, gender }: { name: string; gender: string }) {
    this.name = name;
    this.gender = gender;
  }

  getName() {
    return this.name;
  }

  getGender() {
    return this.gender;
  }
}
