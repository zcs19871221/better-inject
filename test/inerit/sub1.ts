import Base from './base';

export default class Sub1 extends Base {
  private food: string;
  constructor({
    food,
    ...rest
  }: {
    name: string;
    gender: string;
    food: string;
  }) {
    super(rest);
    this.food = food;
  }

  getAll() {
    return this.getName() + this.getGender() + this.food;
  }
}
