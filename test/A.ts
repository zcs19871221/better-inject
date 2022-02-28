import B from './B';
export default class A {
  private b: B;
  constructor(b: B) {
    this.b = b;
  }

  getB() {
    console.log(this.b);
  }
}
