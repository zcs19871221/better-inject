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

const beanMetaKey = Symbol('__inject beanDefinition');
const helper = new MetaHelper<BeanMeta>(beanMetaKey);
const initBeanMeta = (ctr: any): BeanMeta => {
  return {
    type: 'prototype',
    id: classToId(ctr),
    beanClass: ctr,
    autoInjectConstuct: {},
    constructParams: {},
  };
};
const Resource = ({
  type = 'prototype',
  parent = '',
  exposeProxy = false,
  auto = 'byName',
  isController = false,
}: Pick<
  BeanDefinitionConfig,
  'type' | 'parent' | 'exposeProxy' | 'isController'
> & {
  auto?: 'byName' | 'byType' | 'no';
} = {}): ClassDecorator => {
  return ctr => {
    let beanMeta: BeanMeta = helper.get(ctr) || initBeanMeta(ctr);
    beanMeta = {
      ...beanMeta,
      type,
      parent,
      exposeProxy,
      isController,
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
          if (auto === 'byName') {
            classOrOther = classToId(classOrOther);
          }
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
    const beanMeta: BeanMeta = helper.get(ctr) || initBeanMeta(ctr);
    beanMeta.constructParams[index] = {
      value,
      isBean,
    };
    helper.set(ctr, beanMeta);
  };
};

const InjectObj = (prop: { [propName: string]: ConstructParamEach }) => {
  return (ctr: any, _name: string | undefined, index: number) => {
    const beanMeta: BeanMeta = helper.get(ctr) || initBeanMeta(ctr);
    beanMeta.constructParams[index] = [prop];
    helper.set(ctr, beanMeta);
  };
};

export { Resource, Inject, InjectObj, helper, AutoInjectConstruct };
