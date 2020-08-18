import { isClass, classToId } from './class_utils';
import {
  BeanDefinitionConfig,
  ConstructParamEach,
  ConstructParams,
} from '../definition';
import MetaHelper from './metaHelper';

type AutoInjectConstruct = {
  [id: string]: (
    | { index: number; value: string; type: 'byName' }
    | { index: number; value: any; type: 'byType' }
  )[];
};
interface BeanMeta extends Omit<BeanDefinitionConfig, 'constructParams'> {
  autoInjectConstuct: AutoInjectConstruct;
  constructParams: ConstructParams;
}

const beanMetaKey = '__inject beanDefinition';
const helper = new MetaHelper<BeanMeta>(beanMetaKey);
const Resource = ({
  type = 'prototype',
  parent,
  exposeProxy = false,
  auto = 'byName',
}: Pick<BeanDefinitionConfig, 'type' | 'parent' | 'exposeProxy'> & {
  auto?: 'byName' | 'byType' | 'no';
} = {}): ClassDecorator => {
  return ctr => {
    if (helper.get(ctr)) {
      return;
    }
    const beanMeta: BeanMeta = {
      type,
      parent,
      id: classToId(ctr),
      beanClass: ctr,
      exposeProxy,
      constructParams: {},
      autoInjectConstuct: {},
    };
    if (auto !== 'no') {
      const originParams = Reflect.getMetadata('design:paramtypes', ctr);
      if (Array.isArray(originParams)) {
        const autoInjectConstuct = beanMeta.autoInjectConstuct;
        originParams.forEach((classOrOther: any, index: number) => {
          if (!isClass(classOrOther)) {
            return;
          }
          autoInjectConstuct[beanMeta.id] =
            autoInjectConstuct[beanMeta.id] || [];
          autoInjectConstuct[beanMeta.id].push({
            type: auto,
            value: classOrOther,
            index,
          });
        });
      }
    }
    helper.set(ctr, beanMeta);
  };
};

const Inject = (value: any, isBean: boolean = true) => {
  return (ctr: any, _name: string | undefined, index: number) => {
    const beanMeta = helper.get(ctr);
    if (!beanMeta) {
      throw new Error('使用Inject注解前需先用Resource注解');
    }
    beanMeta.constructParams[index] = {
      value,
      isBean,
    };
    helper.set(ctr, beanMeta);
  };
};

const InjectObj = (prop: { [propName: string]: ConstructParamEach }) => {
  return (ctr: any, _name: string | undefined, index: number) => {
    const beanMeta = helper.get(ctr);
    if (!beanMeta) {
      throw new Error('使用InjectObj注解前需先用Resource注解');
    }
    beanMeta.constructParams[index] = [prop];
    helper.set(ctr, beanMeta);
  };
};

export { Resource, Inject, InjectObj, helper, AutoInjectConstruct };
