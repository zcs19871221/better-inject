enum InjectType {
  'prototype',
  'single',
}
interface BeanDefinitionConfig {
  id: string;
  alias?: string | string[];
  beanClass: object;
  properties?: Property[] | Property;
  type?: keyof typeof InjectType;
}
type Property = string | number | boolean;
export { BeanDefinitionConfig };
export default class BeanDefinition {
  private id: string;
  private alias: string[];
  private beanClass: object | string;
  private properties: Property[];
  private type: keyof typeof InjectType;

  constructor({
    id,
    alias = [],
    beanClass,
    properties = [],
    type = 'prototype',
  }: BeanDefinitionConfig) {
    this.id = id;
    this.id = id;
    if (typeof alias === 'string') {
      alias = [alias];
    }
    this.alias = alias;
    if (!Array.isArray(properties)) {
      properties = [properties];
    }
    this.properties = properties;
    this.beanClass = beanClass;
    this.type = type;
  }

  getBeanClass() {
    return this.beanClass;
  }

  getProperties() {
    return this.properties;
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
