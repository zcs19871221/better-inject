import { isClass, classToId } from '../annotation/class_utils';
import {
  BeanDefinitionConfig,
  ConstructParamEach,
  ConstructParams,
} from '../definition';
import MetaHelper from '../annotation/metaHelper';

type AutoInjectConstruct = {
  [id: string]: (
    | { index: number; value: string; type: 'byName' }
    | { index: number; value: any; type: 'byType' }
  )[];
};
interface BeanMeta extends Omit<BeanDefinitionConfig, 'constructParams'> {
  autoInjectConstuct: AutoInjectConstruct;
  constructParams: ConstructParams;
}

const beanMetaKey = Symbol('__inject mvcDefinition');
const helper = new MetaHelper<BeanMeta>(beanMetaKey);

const Controller = ctr => {
};

const RequestMapping = 
export { Resource, Inject, InjectObj, helper, AutoInjectConstruct };
