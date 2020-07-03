enum InjectType {
  'prototype',
  'single',
}
interface ConstructParam {
  index: number;
  isBean?: boolean;
  value: any;
}
interface BeanDefinitionConfig {
  id: string;
  alias?: string | string[];
  beanClass: object;
  constructParams?: ConstructParam[];
  type?: keyof typeof InjectType;
}
export { BeanDefinitionConfig, ConstructParam };
export default class BeanDefinition {
  private id: string;
  private alias: string[];
  private beanClass: object | string;
  private constructParams: ConstructParam[];
  private type: keyof typeof InjectType;

  constructor({
    id,
    alias = [],
    beanClass,
    constructParams = [],
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
}
