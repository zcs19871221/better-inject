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
  parent?: string;
  exposeProxy?: boolean;
  isController?: boolean;
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
  private parent: string;
  private mergedParams: ConstructParams = {};
  private hasMergedParams: boolean = false;
  private exposeProxy: boolean;
  private isControll: boolean;

  constructor({
    id,
    alias = [],
    beanClass,
    constructParams = {},
    type = 'prototype',
    parent = '',
    exposeProxy = false,
    isController = false,
  }: BeanDefinitionConfig) {
    this.id = id;
    if (typeof alias === 'string') {
      alias = [alias];
    }
    this.alias = alias;
    this.constructParams = constructParams;
    this.beanClass = beanClass;
    this.type = type;
    this.parent = parent;
    this.exposeProxy = exposeProxy;
    this.isControll = isController;
  }

  static isValidConfig(mayBeConfig: any) {
    if (!Array.isArray(mayBeConfig)) {
      mayBeConfig = [mayBeConfig];
    }
    return mayBeConfig.every(
      (each: any) => typeof each === 'object' && each.id && each.beanClass,
    );
  }

  isController() {
    return this.isControll;
  }

  getBeanClass() {
    return this.beanClass;
  }

  getExposeProxy() {
    return this.exposeProxy;
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

  getParentId() {
    return this.parent;
  }

  validRelativeBeanId(beanMap: Map<string, BeanDefinition>) {
    if (this.parent && !beanMap.has(this.parent)) {
      throw new Error();
    }
    const check = (config: ConstructParamEach) => {
      if (config.isBean && !beanMap.has(config.value)) {
        throw new Error(`bean:${this.id} 的注入id:${config.value}没有定义`);
      }
    };
    Object.keys(this.constructParams).forEach(key => {
      const index = Number(key);
      const paramOrProps = this.constructParams[index];
      if (Array.isArray(paramOrProps)) {
        const props = paramOrProps[0];
        Object.values(props).forEach(check);
      } else {
        check(paramOrProps);
      }
    });
  }

  mergeAutoInjectConstructParams(index: number, beanId: string): any {
    if (this.constructParams && this.constructParams[index]) {
      return;
    }
    this.constructParams[index] = {
      isBean: true,
      value: beanId,
    };
  }

  getMergedParmas(beanMap: Map<string, BeanDefinition>): ConstructParams {
    if (this.hasMergedParams) {
      return this.mergedParams;
    }
    this.hasMergedParams = true;
    this.mergedParams = {
      ...this.constructParams,
    };
    if (!this.parent) {
      return this.mergedParams;
    }
    const parent = beanMap.get(this.parent);
    if (!parent) {
      throw new Error(`${this.id}不存在id为${this.parent}的定义`);
    }
    const parentParam = parent.getMergedParmas(beanMap);
    Object.keys(parentParam).forEach(key => {
      const index = Number(key);
      const parentConfig = parentParam[index];
      const curConfig = this.mergedParams[index];
      if (curConfig === undefined && parentConfig) {
        this.mergedParams[index] = parentConfig;
        return;
      }
      if (Array.isArray(curConfig) && Array.isArray(parentConfig)) {
        const props: ConstructParamProps = [
          {
            ...parentConfig[0],
            ...curConfig[0],
          },
        ];
        this.mergedParams[index] = props;
      }
    });
    return this.mergedParams;
  }
}
