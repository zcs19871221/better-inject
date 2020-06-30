import BeanDefinition from '../definition/bean_definition';
abstract class FactoryBean {
  abstract getObject(): object;
}
export { FactoryBean };
export default class BeanFactory {
  private definitionMap: Map<string, BeanDefinition> = new Map();
  private singleBeanMap: Map<string, object> = new Map();
  private currentInCreation: Set<string> = new Set();

  private getDefination(idOrName: string): BeanDefinition | null {
    if (this.definitionMap.has(idOrName)) {
      return <BeanDefinition>this.definitionMap.get(idOrName);
    }
    return null;
  }

  static REF_PREFIX = 'ID:';
  public registDefination(definition: BeanDefinition) {
    const id = definition.getId();
    const alias = definition.getAlias();
    const definitionMap = this.definitionMap;
    [id, ...alias].forEach((eachId: string) => {
      if (definitionMap.has(eachId)) {
        throw new Error('重复definitionid:' + eachId);
      }
    });
    [id, ...alias].forEach((eachId: string) => {
      this.definitionMap.set(eachId, definition);
    });
  }

  getBean(idOrName: string, ...args: any[]): object {
    const definition = this.getDefination(idOrName);
    if (!definition) {
      throw new Error('不存在beanid:' + idOrName);
    }
    const id = definition.getId();
    const Ctor = definition.getBeanClass();
    const isFactoryBean = Ctor instanceof FactoryBean;
    const isSingle = definition.getType() === 'single';
    try {
      if (this.currentInCreation.has(id)) {
        throw new Error('循环引用:' + id);
      }
      this.currentInCreation.add(id);
      if (isSingle && this.singleBeanMap.has(id)) {
        return <object>this.singleBeanMap.get(id);
      }
      const properties: any = [...definition.getProperties()];
      for (let index = 0, len = properties.length; index < len; index++) {
        if (args[index] !== undefined) {
          properties[index] = args[index];
          continue;
        }
        if (
          typeof properties[index] === 'string' &&
          properties[index].startsWith(BeanFactory.REF_PREFIX)
        ) {
          properties[index] = this.getBean(
            properties[index].slice(BeanFactory.REF_PREFIX.length),
          );
        }
      }
      let bean = new (<any>Ctor)(...properties);
      if (isFactoryBean) {
        bean = <FactoryBean>bean.getObject();
      }
      if (isSingle) {
        this.singleBeanMap.set(id, bean);
      }
      return bean;
    } finally {
      this.currentInCreation.delete(id);
    }
  }
}
