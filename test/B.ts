import A from './A';

export default class B {
  private a: A;
  constructor(a: A) {
    this.a = a;
  }

  getB() {
    console.log(this.a);
  }
}
