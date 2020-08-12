import 'reflect-metadata';
import BeanFactory from '../factory';
import { AOP, checkAop } from '../aop';
import BeanDefinition, {
  BeanDefinitionConfig,
  ConstructParamEach,
  ConstructParams,
} from '../definition';
import LocateParser from '../locateparser';

type ResouceOpt = Partial<Pick<BeanDefinitionConfig, 'id' | 'parent' | 'type'>>;
class Context {
  private beanFactory: BeanFactory = new BeanFactory();
  private configParser: LocateParser;
  private scanParser: LocateParser;
  private aopParser: LocateParser;

  constructor({
    configFiles = [],
    root,
    scanFiles = [],
    aopConfigFiles = [],
  }: {
    configFiles?: string | string[];
    root?: string;
    scanFiles?: string | string[];
    aopConfigFiles?: string | string[];
  }) {
    this.configParser = new LocateParser(configFiles, root);
    this.scanParser = new LocateParser(scanFiles, root);
    this.aopParser = new LocateParser(aopConfigFiles, root);
    this.configParser.requireDefault().forEach(configModule => {
      if (BeanDefinition.isValidConfig(configModule)) {
        this.regist(configModule);
      }
    });
    this.scanParser.requireDefault().forEach(classModule => {
      const definition = Reflect.getMetadata(Context.metaBeanKey, classModule);
      if (definition) {
        this.regist(definition);
      }
    });
    this.aopParser.requireDefault().forEach(configModule => {
      this.registAop(configModule);
    });
    this.beanFactory.writeAspect();
  }

  private static targetMapProxy: Map<any, any> = new Map();

  static getProxy(ref: any) {
    return Context.targetMapProxy.get(ref);
  }

  static setProxy(originRef: any, proxy: any) {
    if (!Context.targetMapProxy.has(originRef)) {
      Context.targetMapProxy.set(originRef, proxy);
    }
  }

  static delProxy(ref: any) {
    return Context.targetMapProxy.delete(ref);
  }

  private static isClass(v: any): boolean {
    if (typeof v !== 'function') {
      return false;
    }
    return /^\s*class\s+/.test(v.toString());
  }

  private static classToId(ctr: any) {
    return ctr.name.toLowerCase();
  }

  private static metaBeanKey = '__inject beanDefinition';
  private static metaConstructParamKey = '__inject constructParams';

  static Resource(
    opt: ResouceOpt = {
      type: 'prototype',
      parent: '',
      id: '',
    },
  ): ClassDecorator {
    const { id, type, parent } = opt;
    return ctr => {
      if (Reflect.getMetadata(Context.metaBeanKey, ctr)) {
        return;
      }
      const originParams = Reflect.getMetadata('design:paramtypes', ctr);
      const constructParams: ConstructParams =
        Reflect.getMetadata(Context.metaConstructParamKey, ctr) || {};
      if (Array.isArray(originParams)) {
        originParams.forEach((classOrOther: any, index: number) => {
          if (!constructParams[index] && Context.isClass(classOrOther)) {
            constructParams[index] = {
              isBean: true,
              value: id || Context.classToId(classOrOther),
            };
          }
        });
      }
      Reflect.defineMetadata(
        Context.metaBeanKey,
        {
          id: id || Context.classToId(ctr),
          beanClass: ctr,
          constructParams,
          type,
          parent,
        },
        ctr,
      );
    };
  }

  static Inject(value: any, isBean: boolean = true) {
    return (ctr: any, _name: string | undefined, index: number) => {
      const constructParmas: ConstructParams =
        Reflect.getMetadata(Context.metaConstructParamKey, ctr) || {};
      if (!constructParmas[index]) {
        constructParmas[index] = {
          value,
          isBean,
        };
      }
      Reflect.defineMetadata(
        Context.metaConstructParamKey,
        constructParmas,
        ctr,
      );
    };
  }

  static InjectObj(prop: { [propName: string]: ConstructParamEach }) {
    return (ctr: any, _name: string | undefined, index: number) => {
      const constructParmas: ConstructParams =
        Reflect.getMetadata(Context.metaConstructParamKey, ctr) || {};
      if (!constructParmas[index]) {
        constructParmas[index] = [prop];
      }
      Reflect.defineMetadata(
        Context.metaConstructParamKey,
        constructParmas,
        ctr,
      );
    };
  }

  static AopChecker(config: AOP | AOP[]) {
    return config;
  }

  registAop(config: AOP | AOP[]) {
    if (!Array.isArray(config)) {
      config = [config];
    }
    (<any>config).forEach((cf: AOP) => {
      checkAop(cf);
      this.beanFactory.registAop(cf);
    });
  }

  static Checker(config: BeanDefinitionConfig | BeanDefinitionConfig[]) {
    return config;
  }

  regist(config: BeanDefinitionConfig | BeanDefinitionConfig[]) {
    if (!Array.isArray(config)) {
      config = [config];
    }
    (<any>config).forEach((cf: BeanDefinitionConfig) => {
      this.beanFactory.registDefination(new BeanDefinition(cf));
    });
  }

  getBean(idOrName: string, ...args: any[]) {
    return this.beanFactory.getBean(idOrName, ...args);
  }
}
const { Resource, Inject, InjectObj, Checker, AopChecker } = Context;
export { Resource, Inject, InjectObj, Checker, AopChecker };
export default Context;
