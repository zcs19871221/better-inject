import 'reflect-metadata';
import BeanFactory, { POINT_CUT, ASPECT_CONFIG } from '../factory';
import BeanDefinition, { BeanDefinitionConfig } from '../definition';
import LocateParser from '../locateparser';
import { helper as aopHelper } from '../annotation/aop';
import { helper as injectHelper } from '../annotation/inject';

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
    this.configParser.requireDefault().forEach(configModule => {
      this.regist(configModule);
    });
    this.scanParser.requireDefault().forEach(classModule => {
      const injectMetaData = injectHelper.get(classModule);
      if (injectMetaData) {
        this.beanFactory.registDefination(new BeanDefinition(injectMetaData));
        this.beanFactory.addAuoInject(injectMetaData.autoInjectConstuct);
      }
      const aopMetaData = aopHelper.get(classModule);
      if (aopMetaData) {
        this.upgradeLocalPointCut(aopMetaData);
        this.beanFactory.registAspect(aopMetaData);
      }
    });
    this.beanFactory.doRegistBean();
    this.beanFactory.doRegistAspect();
  }

  private static targetMapProxy: Map<any, any> = new Map();

  private upgradeLocalPointCut(aopMetaData: ASPECT_CONFIG) {
    if (
      aopMetaData.adviceConfigs.length === 0 &&
      aopMetaData.pointCuts &&
      aopMetaData.pointCuts.length > 0
    ) {
      const pointCuts = aopMetaData.pointCuts;
      pointCuts.forEach(pointCut => {
        this.beanFactory.registPointCut(pointCut);
      });
      delete aopMetaData.pointCuts;
    }
  }

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
      } else if (cf.type === 'prototype' || cf.type === 'single' || !cf.type) {
        this.beanFactory.registDefination(new BeanDefinition(cf));
      }
    });
  }

  getBean(idOrName: string, ...args: any[]) {
    return this.beanFactory.getBean(idOrName, ...args);
  }
}
export default Context;
