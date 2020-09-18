// import helper from '../mvc/annotation/meta_helper';
import 'reflect-metadata';
import x from './tmp2';

// type X = 'a' | 'b' | 'c';
// type Y = [string, number];
// interface Z {
//   [name: string]: any;
// }
// class Target {
//   param(
//     _str: string,
//     _num: number,
//     _ar: string[],
//     _target: Target,
//     _x: X,
//     _y: Y,
//     _z: Z,
//     _any: any,
//   ) {}

//   return1() {
//     return 'string';
//   }
//   return2(): string {
//     return 'string';
//   }
//   return3(): void {}
//   return4(): this {
//     return this;
//   }
//   return5(): Target {
//     return new Target();
//   }
//   return6(): any {
//     return null;
//   }
// }
// const mvcMeta = helper.initMetaData();
// helper.getOrInitMethodData(mvcMeta, 'param', Target);
// const x = Reflect.getMetadata('design:paramtypes', A.prototype, 'param');
// console.log(x);
function T(_a: any) {}
console.log(x);
// function M(_a: any, _b: any) {
//   // const x = Reflect.getMetadata('design:paramtypes', _a, _b);
//   const x = Reflect.getMetadata('design:paramtypes', _a, 'param');
//   console.log(x);
// }
// function P(_a: any, _b: any, _c: any) {
//   // console.log(Reflect.getMetadata('design:paramtypes', _a, 'param'));
// }

@T
class A {
  param(_a: string): string {
    return '';
  }
}
// class B extends A {}
// Reflect.defineMetadata('fuck', { fuck: 'fuck' }, A);
// console.log(Reflect.hasOwnMetadata('fuck', A));
// console.log(Reflect.hasOwnMetadata('fuck', B));
console.log(Reflect.getMetadata('design:returntype', A.prototype, 'param'));
console.log(Reflect.getMetadata('design:returntype', A.prototype, 'param'));
