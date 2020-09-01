import 'reflect-metadata';
import BeanFactory, { POINT_CUT, ASPECT_CONFIG } from '../factory';
import BeanDefinition, { BeanDefinitionConfig } from '../definition';
import LocateParser from '../locateparser';
import { helper as aopHelper } from '../annotation/aop';
import { helper as injectHelper } from '../annotation/inject';
import { isClass } from '../annotation/class_utils';

type FILE_CONFIG =
  | BeanDefinitionConfig
  | ({
      type: 'pointcut';
    } & POINT_CUT)
  | ({ type: 'aspect' } & ASPECT_CONFIG);
export default class Context {
  private beanFactory: BeanFactory = new BeanFactory();
  private configParser: LocateParser;
  private scanParser: LocateParser;
  private debug: Boolean;

  constructor({
    configFiles = [],
    root,
    scanFiles = [],
    debug = false,
    buildDir = 'dist',
  }: {
    configFiles?: string | string[];
    root?: string;
    scanFiles?: string | string[];
    debug?: boolean;
    buildDir?: string;
  }) {
    this.debug = debug;
    this.configParser = new LocateParser(configFiles, root, buildDir, debug);
    this.scanParser = new LocateParser(scanFiles, root, buildDir, debug);
    this.configParser.requireDefault().forEach(configModule => {
      this.regist(configModule);
    });
    this.scanParser.requireDefault().forEach(classModule => {
      if (!isClass(classModule)) {
        return;
      }
      const injectMetaData = injectHelper.get(classModule);
      if (injectMetaData) {
        this.beanFactory.registDefination(new BeanDefinition(injectMetaData));
        this.beanFactory.addAuoInject(injectMetaData.autoInjectConstuct);
      }
      let aopMetaData = aopHelper.get(classModule);
      if (aopMetaData) {
        aopMetaData = this.upgradeLocalPointCut(aopMetaData);
        this.beanFactory.registAspect(aopMetaData);
      }
      if (debug) {
        console.debug(classModule, injectMetaData, aopMetaData);
      }
    });
    this.beanFactory.doRegistBean();
    this.beanFactory.doRegistAspect();
    this.beanFactory.doRegistMvc();
  }

  private static targetMapProxy: Map<any, any> = new Map();

  private upgradeLocalPointCut(aopMetaData: ASPECT_CONFIG): ASPECT_CONFIG {
    if (this.debug) {
      console.debug(aopMetaData);
    }
    if (
      aopMetaData.adviceConfigs.length === 0 &&
      aopMetaData.pointCuts &&
      aopMetaData.pointCuts.length > 0
    ) {
      const pointCuts = aopMetaData.pointCuts;
      pointCuts.forEach(pointCut => {
        this.beanFactory.registPointCut(pointCut);
      });
      aopMetaData = {
        ...aopMetaData,
      };
      delete aopMetaData.pointCuts;
    }
    return aopMetaData;
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
