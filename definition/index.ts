import FactoryBean from '../factory/factory_bean';

enum InjectType {
  'prototype',
  'single',
}
interface ConstructParamEach {
  isBean?: boolean;
  value: any;
}
type ConstructParamProps = [
  {
    [propName: string]: ConstructParamEach;
  },
];

interface ConstructParams {
  [index: number]: ConstructParamEach | ConstructParamProps;
}

interface BeanClass {
  prototype: object;
}
interface BeanDefinitionConfig {
  id: string;
  alias?: string | string[];
  beanClass: BeanClass;
  constructParams?: ConstructParams;
  type?: keyof typeof InjectType;
}
export {
  BeanDefinitionConfig,
  ConstructParams,
  ConstructParamEach,
  ConstructParamProps,
};
export default class BeanDefinition {
  private id: string;
  private alias: string[];
  private beanClass: BeanClass;
  private constructParams: ConstructParams;
  private type: keyof typeof InjectType;

  constructor({
    id,
    alias = [],
    beanClass,
    constructParams = {},
    type = 'prototype',
  }: BeanDefinitionConfig) {
    this.id = id;
    if (typeof alias === 'string') {
      alias = [alias];
    }
    this.alias = alias;
    this.constructParams = constructParams;
    this.beanClass = beanClass;
    this.type = type;
  }

  static isValidConfig(mayBeConfig: any) {
    if (!Array.isArray(mayBeConfig)) {
      mayBeConfig = [mayBeConfig];
    }
    return mayBeConfig.every(
      (each: any) => typeof each === 'object' && each.id && each.beanClass,
    );
  }

  getBeanClass() {
    return this.beanClass;
  }

  getParams() {
    return this.constructParams;
  }

  getType() {
    return this.type;
  }

  getAlias() {
    return this.alias;
  }

  getId() {
    return this.id;
  }

  isFactoryBean() {
    return this.beanClass.prototype instanceof FactoryBean;
  }
}
