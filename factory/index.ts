import BeanDefinition, {
  ConstructParamEach,
  ConstructParamProps,
} from '../definition';
import Invoker from '../aop/invoker_implement';
import Aspect, { ASPECT_ARGS } from '../aop/aspect';
import POINT_CUT, { POINT_CUT_MATCHER } from '../aop/point_cut';
import Advice, { AdviceCtr, Advice_Position } from '../aop/advice';
import Advisor from '../aop/advisor';
import BeforeAdvice from '../aop/before_advice';
import AfterAdvice from '../aop/after_advice';
import AroundAdvice from '../aop/around_advice';
import AfterReturnAdvice from '../aop/after_return_advice';
import AfterThrowAdvice from '../aop/after_throw_advice';
import { AutoInjectConstruct } from '../annotation/inject';

interface ASPECT_CONFIG extends ASPECT_ARGS {
  adviceId?: any;
  adviceConfigs: [
    typeof Advice_Position[number],
    string,
    string | POINT_CUT_MATCHER,
  ][];
}
export { ASPECT_CONFIG, POINT_CUT };
export default class BeanFactory {
  private static FACTORY_BEANID_PREFIX = '&';

  private definitionMap: Map<string, BeanDefinition> = new Map();
  private singleBeanMap: Map<string, object> = new Map();
  private currentInCreation: Set<string> = new Set();
  private aspectMap: Map<string, Aspect> = new Map();
  private pointCutMap: Map<string, POINT_CUT> = new Map();
  private advisors: Advisor[] = [];
  private tmpAspectConfig: ASPECT_CONFIG[] = [];
  private tempBeanAutoConstruct: AutoInjectConstruct[] = [];

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

  addAuoInject(config: AutoInjectConstruct) {
    this.tempBeanAutoConstruct.push(config);
  }

  registPointCut(pointCut: POINT_CUT) {
    const id = pointCut.id;
    if (!id || this.pointCutMap.has(id)) {
      throw new Error('pointcut id ' + id + '重复');
    }
    this.pointCutMap.set(id, pointCut);
  }

  registAspect(aspectConfig: ASPECT_CONFIG) {
    this.tmpAspectConfig.push(aspectConfig);
  }

  doRegistBean() {
    this.mergeAutoInject();
    this.checkBean();
  }

  doRegistAspect() {
    this.tmpAspectConfig.forEach(aspectConfig => {
      if (this.aspectMap.has(aspectConfig.id)) {
        throw new Error('重复aspectId' + aspectConfig.id);
      }
      const aspect = new Aspect({
        id: aspectConfig.id,
        pointCuts: aspectConfig.pointCuts,
        order: aspectConfig.order,
      });
      this.aspectMap.set(aspectConfig.id, aspect);
      this.registAdvisor(
        aspectConfig.adviceId || aspectConfig.id,
        aspectConfig.adviceConfigs,
        aspect,
      );
    });
    this.tmpAspectConfig = [];
  }

  private getDefination(idOrName: string): BeanDefinition | null {
    if (this.definitionMap.has(idOrName)) {
      return <BeanDefinition>this.definitionMap.get(idOrName);
    }
    return null;
  }

  private checkBean() {
    for (const def of this.definitionMap.values()) {
      def.validRelativeBeanId(this.definitionMap);
    }
  }

  private mergeAutoInject() {
    this.tempBeanAutoConstruct.forEach(autoConfig => {
      for (const [beanId, configs] of Object.entries(autoConfig)) {
        const bean = this.definitionMap.get(beanId);
        if (!bean) {
          throw new Error(`beanId:${beanId}不存在`);
        }
        configs.forEach(config => {
          const { index, value: idOrClass, type } = config;
          if (type === 'byName') {
            if (!this.definitionMap.has(idOrClass)) {
              throw new Error(
                `beanId:${beanId}使用Resouce使用auto的byName没有找到beanId:${idOrClass}`,
              );
            }
            bean.mergeAutoInjectConstructParams(index, idOrClass);
          } else if (type === 'byType') {
            const targetBean = [...this.definitionMap.values()].find(
              (def: BeanDefinition) => def.getBeanClass() === idOrClass,
            );
            if (!targetBean) {
              throw new Error(
                `beanId:${beanId}Resouce使用auto的byType没有找到类`,
              );
            }
            bean.mergeAutoInjectConstructParams(index, targetBean.getId());
          }
        });
      }
    });
    this.tempBeanAutoConstruct = [];
  }

  private registAdvisor(
    adviceId: string,
    adviceConfigs: ASPECT_CONFIG['adviceConfigs'],
    aspect: Aspect,
  ) {
    const adviceBean = this.getBean(adviceId);
    adviceConfigs.forEach(([position, methodName, pointCutIdOrMatcher]) => {
      let pointCutMatcher: POINT_CUT_MATCHER;
      if (typeof pointCutIdOrMatcher == 'string') {
        let pointCut = aspect
          .getPointCuts()
          .find(each => each.id === pointCutIdOrMatcher);
        if (!pointCut) {
          pointCut = this.getPointCut(pointCutIdOrMatcher);
        }
        if (!pointCut) {
          throw new Error(`pointCutId:${pointCutIdOrMatcher}不存在`);
        }
        pointCutMatcher = pointCut;
      } else {
        pointCutMatcher = pointCutIdOrMatcher;
      }
      let Ctr: AdviceCtr;
      switch (position) {
        case 'before':
          Ctr = BeforeAdvice;
          break;
        case 'after':
          Ctr = AfterAdvice;
          break;
        case 'around':
          Ctr = AroundAdvice;
          break;
        case 'afterThrow':
          Ctr = AfterThrowAdvice;
          break;
        case 'afterReturn':
          Ctr = AfterReturnAdvice;
          break;
        default:
          throw new Error('错误连接点' + position);
      }
      this.advisors.push(
        new Advisor({
          advice: new Ctr({
            adviceMethod: methodName,
            advice: adviceBean,
          }),
          aspect,
          ...pointCutMatcher,
        }),
      );
    });
  }

  private getPointCut(id: string) {
    return this.pointCutMap.get(id);
  }

  private createAopProxyBean(bean: any, beanId: string, exposeProxy: boolean) {
    let advisors = this.advisors.filter(advisor => advisor.matchClass(beanId));
    if (advisors.length > 0) {
      const proxy = new Proxy(bean, {
        get: function proxyMethod(target, targetMethod) {
          const origin = Reflect.get(target, targetMethod);
          if (
            typeof origin === 'function' &&
            typeof targetMethod !== 'symbol'
          ) {
            const matchedAdvisors = advisors.filter(aspect =>
              aspect.matchMethod(<string>targetMethod),
            );
            if (matchedAdvisors.length > 0) {
              const adviceChains = BeanFactory.groupSort(matchedAdvisors);
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

  private static groupSort(advisors: Advisor[]): Advice[] {
    const res: {
      [pos in typeof Advice_Position[number]]?: Advice[];
    }[] = [];
    advisors.forEach(each => {
      const order = each.getOrder();
      const pos = each.getAdvicePosition();
      res[order] = res[order] || {};
      res[order][pos] = res[order][pos] || [];
      res[order][pos]?.push(each.getAdvice());
    });
    return res.reduce((acc: Advice[], cur) => {
      Advice_Position.forEach(postion => {
        const advices = cur[postion];
        if (advices !== undefined) {
          acc.push(...advices);
        }
      });
      return acc;
    }, []);
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
