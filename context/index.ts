import 'reflect-metadata';
import BeanFactory from '../factory';
import BeanDefinition, {
  BeanDefinitionConfig,
  ConstructParam,
} from '../definition';
import LocateParser from '../locateparser';

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
    this.configParser.getLocates().forEach(locate => {
      const target = this.configParser.require(locate);
      if (!target) {
        return;
      }
      this.regist(target);
    });
    this.scanParser.getLocates().forEach(locate => {
      const target = this.scanParser.require(locate);
      if (!target) {
        return;
      }
      const definition = Reflect.getMetadata(Context.metaBeanKey, target);
      if (definition) {
        this.regist(definition);
      }
    });
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

  private static metaBeanKey = '_beanDefinition';
  private static metaConstructParamKey = '_constructParams';

  static Resource(type: 'single' | 'prototype' = 'prototype'): ClassDecorator {
    return ctr => {
      if (Reflect.getMetadata(Context.metaBeanKey, ctr)) {
        return;
      }
      const originParams = Reflect.getMetadata('design:paramtypes', ctr);
      const constructParams: ConstructParam[] =
        Reflect.getMetadata(Context.metaConstructParamKey, ctr) || [];
      if (Array.isArray(originParams)) {
        originParams.forEach((classOrOther: any, index: number) => {
          if (
            !constructParams.find(each => each.index === index) &&
            Context.isClass(classOrOther)
          ) {
            constructParams.push({
              isBean: true,
              value: Context.classToId(classOrOther),
              index,
            });
          }
        });
      }
      Reflect.defineMetadata(
        Context.metaBeanKey,
        {
          id: Context.classToId(ctr),
          beanClass: ctr,
          constructParams,
          type,
        },
        ctr,
      );
    };
  }

  static Inject(value: any = null, isBean: boolean = true) {
    return (ctr: any, _name: string | undefined, index: number) => {
      const constructParmas: ConstructParam[] =
        Reflect.getMetadata(Context.metaConstructParamKey, ctr) || [];
      if (!constructParmas.find(each => each.index !== index)) {
        constructParmas.push({
          index,
          value,
          isBean,
        });
      }
      Reflect.defineMetadata(
        Context.metaConstructParamKey,
        constructParmas,
        ctr,
      );
    };
  }
  static valid(config: BeanDefinitionConfig | BeanDefinitionConfig[]) {
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
const { Resource, Inject } = Context;
export { Resource, Inject };
export default Context;
