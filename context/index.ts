import 'reflect-metadata';
import BeanFactory, { POINT_CUT, ASPECT_CONFIG } from '../factory';
import BeanDefinition, { BeanDefinitionConfig } from '../definition';
import LocateParser from '../locateparser';

type FILE_CONFIG =
  | BeanDefinitionConfig
  | ({
      type: 'pointcut';
    } & POINT_CUT)
  | ({ type: 'aspect' } & ASPECT_CONFIG);
class Context {
  private beanFactory: BeanFactory = new BeanFactory();
  private configParser: LocateParser;
  private scanParser: LocateParser;

  constructor({
    configFiles = [],
    root,
    scanFiles = [],
  }: {
    configFiles?: string | string[];
    root?: string;
    scanFiles?: string | string[];
  }) {
    this.configParser = new LocateParser(configFiles, root);
    this.scanParser = new LocateParser(scanFiles, root);
    this.configParser.requireDefault().forEach((configModule) => {
      if (BeanDefinition.isValidConfig(configModule)) {
        this.regist(configModule);
      }
    });
    this.scanParser.requireDefault().forEach((classModule) => {
      const definition = Reflect.getMetadata(Context.metaBeanKey, classModule);
      if (definition) {
        this.regist(definition);
      }
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

  static Checker(config: FILE_CONFIG | FILE_CONFIG[]) {
    return config;
  }

  regist(config: FILE_CONFIG | FILE_CONFIG[]) {
    if (!Array.isArray(config)) {
      config = [config];
    }
    (<any>config).forEach((cf: FILE_CONFIG) => {
      if (cf.type === 'pointcut') {
        this.beanFactory.registPointCut(cf);
      } else if (cf.type === 'aspect') {
        this.beanFactory.registAspect(cf);
      } else if (cf.type === 'prototype' || cf.type === 'single') {
        this.beanFactory.registDefination(new BeanDefinition(cf));
      }
    });
  }

  getBean(idOrName: string, ...args: any[]) {
    return this.beanFactory.getBean(idOrName, ...args);
  }
}
const { Checker } = Context;
export { Checker };
export default Context;
