class B {}
@ClassDecorator
class A {
  @PropDecorator
  private prop: string = '1234';
  @Method
  @Method1
  aMethod() {}

  @Method
  static sMethod() {}

  fuck(a: number, @ParamDecorator b: B) {
    console.log(this.prop, a, b);
  }
}
function ParamDecorator(
  constructorOrProto: any,
  propName: string,
  parameterIndex: number,
) {
  console.log(constructorOrProto, propName, parameterIndex);
}
function PropDecorator(constructorOrProto: any, propName: string) {
  console.log(constructorOrProto, propName);
}
function Method(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor,
) {
  console.log(target, propertyKey, descriptor);
}
function Method1(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor,
) {
  console.log(target, propertyKey, descriptor);
}

function ClassDecorator(constructor: Function) {
  console.log(constructor);
}
// const a = new A();
// console.log(a);

// const a = new A();
