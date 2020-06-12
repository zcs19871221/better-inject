import 'reflect-metadata';
function PropDecorator(target: any, prop: string) {
  const t = Reflect.getMetadata('design:type', target, prop);
  console.log(t);
}
function MethodDecorator(target: any, prop: string, _desc: any) {
  const t = Reflect.getMetadata('design:type', target, prop);
  const a = Reflect.getMetadata('design:paramtypes', target, prop);
  const b = Reflect.getMetadata('design:returntype', target, prop);
  console.log(t, a, b);
}
function ParamDecorator(target: any, prop: string, pos: number) {
  console.log(target, prop, pos);
}
class B {}
class A {
  @PropDecorator
  private name: B[] = [new B()];
  @MethodDecorator
  fuck(@ParamDecorator a: string, b: number): string {
    console.log(this.name, a, b);
    return 'fuck';
  }
}
console.log(A);
