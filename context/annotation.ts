import 'reflect-metadata';
import { ConstructParam } from '../definition/bean_definition';
import Context from './context';

const context = new Context();
const isClass = (v: any): boolean => {
  if (typeof v !== 'function') {
    return false;
  }
  return /^\s*class\s+/.test(v.toString());
};
const classToId = (ctr: any) => {
  return ctr.name.toLowerCase();
};
const Resource = (
  type: 'single' | 'prototype' = 'prototype',
): ClassDecorator => {
  return ctr => {
    const originParams = Reflect.getMetadata('design:paramtypes', ctr);
    const constructParams: ConstructParam[] = [];
    originParams.forEach((classOrOther: any, index: number) => {
      if (isClass(classOrOther)) {
        constructParams.push({
          isBean: true,
          value: classToId(classOrOther),
          index,
        });
      }
    });
    context.regist({
      id: classToId(ctr),
      beanClass: ctr,
      constructParams,
      type,
    });
  };
};
export { Resource };
export default context;
