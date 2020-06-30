import 'reflect-metadata';
import BeanFactory from '../factory/bean_factory';
import BeanDefinition, {
  BeanDefinitionConfig,
  ConstructParam,
} from '../definition/bean_definition';
import LocateParser from '../locateparser/locate_parser';

class Context {
  private beanFactory: BeanFactory = new BeanFactory();
  private configParser: LocateParser;
  private scanParser: LocateParser;

  constructor(
    {
      configFiles = [],
      root,
      scanFiles = [],
    }: {
      configFiles?: string | string[];
      root?: string;
      scanFiles?: string | string[];
    } = { configFiles: [], scanFiles: [] },
  ) {
    this.configParser = new LocateParser(configFiles, root);
    this.scanParser = new LocateParser(scanFiles, root);
    this.configParser.getLocates().forEach(locate => {
      this.regist(Context.require(locate));
    });
    this.scanParser.getLocates().forEach(locate => {
      const target = Context.require(locate);
      const definition = Reflect.getMetadata(Context.metaKey, target);
      if (definition) {
        this.regist(definition);
      }
    });
  }

  private static require(locate: string) {
    const target = require(locate);
    if (target && target.default) {
      return target.default;
    }
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

  private static metaKey = '_beanDefinition';

  static Resource(type: 'single' | 'prototype' = 'prototype'): ClassDecorator {
    return ctr => {
      const originParams = Reflect.getMetadata('design:paramtypes', ctr);
      const constructParams: ConstructParam[] = [];
      originParams.forEach((classOrOther: any, index: number) => {
        if (Context.isClass(classOrOther)) {
          constructParams.push({
            isBean: true,
            value: Context.classToId(classOrOther),
            index,
          });
        }
      });
      Reflect.defineMetadata(
        Context.metaKey,
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
const Resource = Context.Resource;
export { Resource };
export default Context;
