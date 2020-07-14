import Base from './base';

export default class Sub2 extends Base {
  private drink: string;
  constructor({
    drink,
    ...rest
  }: {
    name: string;
    gender: string;
    drink: string;
  }) {
    super(rest);
    this.drink = drink;
  }

  getAll() {
    return this.getName() + this.getGender() + this.drink;
  }
}
