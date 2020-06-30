import BeanFactory from '../factory/bean_factory';
import BeanDefinition, {
  BeanDefinitionConfig,
} from '../definition/bean_definition';
import LocateParser from '../locateparser/locate_parser';

export default class ConfigContext {
  private beanFactory: BeanFactory = new BeanFactory();
  private locateParser: LocateParser;
  constructor(filePaths: string | string[] = [], root?: string) {
    this.locateParser = new LocateParser(filePaths, root);
    this.registFiles(filePaths);
  }

  regist(config: BeanDefinitionConfig | BeanDefinitionConfig[]) {
    if (!Array.isArray(config)) {
      config = [config];
    }
    (<any>config).forEach((cf: BeanDefinitionConfig) => {
      this.beanFactory.registDefination(new BeanDefinition(cf));
    });
  }

  registFiles(filePaths: string | string[]) {
    this.locateParser.setFilePaths(filePaths);
    this.locateParser.getLocates().forEach(locate => {
      this.regist(require(locate).default);
    });
  }

  getBean(idOrName: string, ...args: any[]) {
    return this.beanFactory.getBean(idOrName, ...args);
  }
}
