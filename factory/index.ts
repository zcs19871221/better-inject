import BeanDefinition, {
  ConstructParamEach,
  ConstructParamProps,
} from '../definition';
import BeforeAdvisor from '../aop/before_advisor';
import AfterAdvisor from '../aop/after_advisor';
import AroundAdvisor from '../aop/around_advisor';
import ErrorCatchAdvisor from '../aop/error_catch_advisor';
import Advisor, { Matcher } from '../aop/adivsor';
import Invoker from '../aop/invoker';

enum JoinPoint {
  before,
  around,
  errorCatch,
  after,
}
interface Aspect {
  adviceId: string;
  classMatcher: Matcher | Matcher[];
  methodMatcher: Matcher | Matcher[];
  joinPoint: [keyof typeof JoinPoint, string?][];
}
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
export { Aspect, isAspectConfig };
export default class BeanFactory {
  static FACTORY_BEANID_PREFIX = '&';

  private definitionMap: Map<string, BeanDefinition> = new Map();
  private singleBeanMap: Map<string, object> = new Map();
  private currentInCreation: Set<string> = new Set();
  private advisors: Advisor[] = [];

  private getDefination(idOrName: string): BeanDefinition | null {
    if (this.definitionMap.has(idOrName)) {
      return <BeanDefinition>this.definitionMap.get(idOrName);
    }
    return null;
  }

  getAdvisors() {
    return this.advisors;
  }

  registAdvisor({ classMatcher, methodMatcher, adviceId, joinPoint }: Aspect) {
    const advice = this.getBean(adviceId);
    joinPoint.forEach(point => {
      let [position, methodName] = point;
      if (methodName === undefined) {
        methodName = position;
      }
      let advisor: Advisor;
      switch (position) {
        case 'before':
          advisor = new BeforeAdvisor({
            classMatcher,
            methodMatcher,
            adviceMethod: methodName,
            advice,
          });
          break;
        case 'after':
          advisor = new AfterAdvisor({
            classMatcher,
            methodMatcher,
            adviceMethod: methodName,
            advice,
          });
          break;
        case 'around':
          advisor = new AroundAdvisor({
            classMatcher,
            methodMatcher,
            adviceMethod: methodName,
            advice,
          });
          break;
        case 'errorCatch':
          advisor = new ErrorCatchAdvisor({
            classMatcher,
            methodMatcher,
            adviceMethod: methodName,
            advice,
          });
          break;
        default:
          throw new Error('错误连接点' + position);
      }
      this.advisors.push(advisor);
    });
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
      bean = this.createAopProxyBean(bean, id);
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

  private createAopProxyBean(bean: any, beanId: string) {
    const advisors = this.advisors.filter(advisor =>
      advisor.matchClass(beanId),
    );
    if (advisors.length > 0) {
      const proxy = new Proxy(bean, {
        get: function proxyMethod(target, targetMethod) {
          const origin = Reflect.get(target, targetMethod);
          if (
            typeof origin === 'function' &&
            typeof targetMethod !== 'symbol'
          ) {
            const advisorChains = advisors.filter(advisor =>
              advisor.matchMethod(String(targetMethod)),
            );
            if (advisorChains.length > 0) {
              return function(...args: any[]) {
                const invoker = new Invoker({
                  target,
                  targetMethod,
                  proxy,
                  args,
                  advisorChains,
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
