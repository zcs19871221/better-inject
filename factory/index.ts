import BeanDefinition, {
  ConstructParamEach,
  ConstructParamProps,
} from '../definition';
import Invoker from '../aop/invoker';
import Aspect, { AspectOpt } from '../aop/aspect';
import Advice from '../aop/advice';

const isAspectConfig = (config: any) => {
  if (!Array.isArray(config)) {
    config = [config];
  }
  return config.every(
    (each: any) =>
      each &&
      each.adviceId &&
      each.classMatcher &&
      each.methodMatcher &&
      each.joinPoint,
  );
};
type AspectConfig = Omit<AspectOpt, 'advice'> & { adviceId: string };
export { AspectConfig, isAspectConfig };
export default class BeanFactory {
  private static FACTORY_BEANID_PREFIX = '&';

  private definitionMap: Map<string, BeanDefinition> = new Map();
  private singleBeanMap: Map<string, object> = new Map();
  private currentInCreation: Set<string> = new Set();
  private aspects: Aspect[] = [];

  private getDefination(idOrName: string): BeanDefinition | null {
    if (this.definitionMap.has(idOrName)) {
      return <BeanDefinition>this.definitionMap.get(idOrName);
    }
    return null;
  }

  registAspect({
    classMatcher,
    methodMatcher,
    adviceId,
    joinPoint,
    order,
  }: Omit<AspectOpt, 'advice'> & { adviceId: string }) {
    const advice = this.getBean(adviceId);
    this.aspects.push(
      new Aspect({
        classMatcher,
        methodMatcher,
        advice,
        joinPoint,
        order,
      }),
    );
  }

  registDefination(definition: BeanDefinition) {
    const id = definition.getId();
    const alias = definition.getAlias();
    const definitionMap = this.definitionMap;
    const toRegist = [id, ...alias];
    if (definition.isFactoryBean()) {
      toRegist.push(`${BeanFactory.FACTORY_BEANID_PREFIX}${id}`);
    }
    toRegist.forEach((eachId: string) => {
      if (definitionMap.has(eachId)) {
        throw new Error('重复definitionid:' + eachId);
      }
    });
    toRegist.forEach((eachId: string) => {
      this.definitionMap.set(eachId, definition);
    });
  }

  getBean(idOrName: string, ...args: any[]): object {
    const definition = this.getDefination(idOrName);
    if (!definition) {
      throw new Error('不存在beanid:' + idOrName);
    }
    const Ctor = definition.getBeanClass();
    const isFactoryBean = definition.isFactoryBean();
    const isSingle = definition.getType() === 'single';
    const id =
      isFactoryBean && idOrName.startsWith(BeanFactory.FACTORY_BEANID_PREFIX)
        ? idOrName
        : definition.getId();
    try {
      if (this.currentInCreation.has(id)) {
        throw new Error('循环引用:' + id);
      }
      this.currentInCreation.add(id);
      if (isSingle && this.singleBeanMap.has(id)) {
        return <object>this.singleBeanMap.get(id);
      }
      let bean = new (<any>Ctor)(
        ...this.injectConstructParams(definition, args),
      );
      bean = this.createAopProxyBean(bean, id, definition.getExposeProxy());
      if (isFactoryBean && !id.startsWith(BeanFactory.FACTORY_BEANID_PREFIX)) {
        bean = bean.getObject();
      }

      if (isSingle) {
        this.singleBeanMap.set(id, bean);
      }
      return bean;
    } finally {
      this.currentInCreation.delete(id);
    }
  }

  private createAopProxyBean(bean: any, beanId: string, exposeProxy: boolean) {
    let filteredAspects = this.aspects.filter(aspect =>
      aspect.matchClass(beanId),
    );
    if (filteredAspects.length > 0) {
      const proxy = new Proxy(bean, {
        get: function proxyMethod(target, targetMethod) {
          const origin = Reflect.get(target, targetMethod);
          if (
            typeof origin === 'function' &&
            typeof targetMethod !== 'symbol'
          ) {
            const aspects = filteredAspects.filter(aspect =>
              aspect.matchMethod(<string>targetMethod),
            );
            if (aspects.length > 0) {
              aspects.sort((a, b) => b.getOrder() - a.getOrder());
              const adviceChains = aspects.reduce((acc: Advice[], aspect) => {
                acc.push(...aspect.getAdvice());
                return acc;
              }, []);
              return function(...args: any[]) {
                const invoker = new Invoker({
                  target,
                  targetMethod,
                  proxy,
                  args,
                  adviceChains,
                  exposeProxy,
                });
                return invoker.invoke();
              };
            }
          }
          return origin;
        },
      });
      return proxy;
    }
    return bean;
  }

  private injectConstructParams(
    definition: BeanDefinition,
    args: any[],
  ): any[] {
    const params: any[] = [...args];
    Object.entries(definition.getMergedParmas(this.definitionMap)).forEach(
      ([key, eachConfig]: [
        string,
        ConstructParamProps | ConstructParamEach,
      ]) => {
        const index = Number(key);
        if (Array.isArray(eachConfig)) {
          const toInjectObject = eachConfig[0];
          if (
            params[index] !== undefined &&
            typeof params[index] !== 'object'
          ) {
            throw new Error('注入是对象类型,getBean参数不是');
          }
          const prop = Object.keys(toInjectObject).reduce(
            (acc: any, propName) => {
              acc[propName] = this.getRealValue(toInjectObject[propName]);
              return acc;
            },
            {},
          );
          params[index] = {
            ...prop,
            ...(params[index] &&
              Object.keys(params[index]).reduce((acc: any, key) => {
                if (params[index][key] !== undefined) {
                  acc[key] = params[index][key];
                }
                return acc;
              }, {})),
          };
        } else {
          if (params[index] === undefined) {
            params[index] = this.getRealValue(eachConfig);
          }
        }
      },
    );
    return params;
  }

  private getRealValue(config: ConstructParamEach) {
    const { isBean, value } = config;
    if (isBean) {
      return this.getBean(value);
    }
    return value;
  }
}
