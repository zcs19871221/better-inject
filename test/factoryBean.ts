import FactoryBean from '../factory/factory_bean';
class Person {
  private name: string;
  constructor(name: string) {
    this.name = name;
  }

  getName() {
    return this.name;
  }
}
export { Person };
export default class F implements FactoryBean {
  private name: string;
  constructor(name: string) {
    this.name = name;
  }

  getObject() {
    return new Person(this.name);
  }
}
