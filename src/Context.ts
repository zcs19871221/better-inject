import BeanFactory from './bean_factory';
import BeanDefinition, { BeanDefinitionConfig } from './bean_definition';

export default class ConfigContext {
  private beanFactory: BeanFactory = new BeanFactory();

  static instance: ConfigContext | null = null;

  static get(): ConfigContext {
    if (!ConfigContext.instance) {
      ConfigContext.instance = new ConfigContext();
    }
    return ConfigContext.instance;
  }

  static regist(config: BeanDefinitionConfig) {
    const context = ConfigContext.get();
    context.beanFactory.registDefination(new BeanDefinition(config));
  }

  getBean(idOrName: string, ...args: any[]) {
    return this.beanFactory.getBean(idOrName, ...args);
  }
}
