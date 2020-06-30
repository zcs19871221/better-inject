// import Dao from './dao';
// import 'reflect-metadata';
// // id: 'dao',
// // alias: ['Dao', 'do', 'ao'],
// // beanClass: Dao,
// // properties: 'oracle',
// // type: 'single',
// // const map: any = {};
// type GenericClassDecorator<T> = (target: T) => void;
// interface Type<T> {
//   new (...args: any[]): T;
// }

// const Resource = (
//   type: 'signle' | 'prototype' = 'prototype',
// ): ClassDecorator => {
//   return target => {
//     const constructParams = Reflect.getMetadata('design:paramtypes', target);
//     const constructParamsDefinitions = [];
//     constructParams.forEach((classOrOther, index) => {
//       if (isClass(classOrOther)) {
//         constructParamsDefinitions.push({
//           type: 'class',
//           value: classOrOther.name,
//         });
//       }
//     });
//     const id = target.name;
//     const beanClass = target;
//     const properties = [constructParams];
//     map[id] = {
//       id,
//       beanClass,
//       constructParams,
//       type,
//     };
//   };
// };
// // const Inject = (value: any) => {
// //   return (ctr: any, name: any, ref: any) => {
// //     console.log(ctr, name, ref, value);
// //   };
// // };
// @Resource()
// export default class Service {
//   private dao: Dao;
//   constructor(dao: Dao, name: string) {
//     this.dao = dao;
//     console.log(name);
//   }

//   getDao() {
//     return this.dao;
//   }
// }
