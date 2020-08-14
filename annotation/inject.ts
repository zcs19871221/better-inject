import { isClass, classToId } from './class_utils';
import {
  BeanDefinitionConfig,
  ConstructParamEach,
  ConstructParams,
} from '../definition';

type ResouceOpt = Partial<Pick<BeanDefinitionConfig, 'id' | 'parent' | 'type'>>;

const metaBeanKey = '__inject beanDefinition';
const metaConstructParamKey = '__inject constructParams';

const Resource = (
  opt: ResouceOpt = {
    type: 'prototype',
    parent: '',
    id: '',
  },
): ClassDecorator => {
  const { id, type, parent } = opt;
  return defineResource(id, type, parent);
};

const defineResource = (
  id: string | undefined,
  type: string | undefined,
  parent: string | undefined,
): ClassDecorator => {
  return ctr => {
    if (Reflect.getMetadata(metaBeanKey, ctr)) {
      return;
    }
    const originParams = Reflect.getMetadata('design:paramtypes', ctr);
    const constructParams: ConstructParams =
      Reflect.getMetadata(metaConstructParamKey, ctr) || {};
    if (Array.isArray(originParams)) {
      originParams.forEach((classOrOther: any, index: number) => {
        if (!constructParams[index] && isClass(classOrOther)) {
          constructParams[index] = {
            isBean: true,
            value: id || classToId(classOrOther),
          };
        }
      });
    }
    Reflect.defineMetadata(
      metaBeanKey,
      {
        id: id || classToId(ctr),
        beanClass: ctr,
        constructParams,
        type,
        parent,
      },
      ctr,
    );
  };
};

const Inject = (value: any, isBean: boolean = true) => {
  return (ctr: any, _name: string | undefined, index: number) => {
    const constructParmas: ConstructParams =
      Reflect.getMetadata(metaConstructParamKey, ctr) || {};
    if (!constructParmas[index]) {
      constructParmas[index] = {
        value,
        isBean,
      };
    }
    Reflect.defineMetadata(metaConstructParamKey, constructParmas, ctr);
  };
};

const InjectObj = (prop: { [propName: string]: ConstructParamEach }) => {
  return (ctr: any, _name: string | undefined, index: number) => {
    const constructParmas: ConstructParams =
      Reflect.getMetadata(metaConstructParamKey, ctr) || {};
    if (!constructParmas[index]) {
      constructParmas[index] = [prop];
    }
    Reflect.defineMetadata(metaConstructParamKey, constructParmas, ctr);
  };
};

export { Resource, Inject, InjectObj, defineResource };
