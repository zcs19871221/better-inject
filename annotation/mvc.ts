import { isClass, classToId } from './class_utils';
import {
  BeanDefinitionConfig,
  ConstructParamEach,
  ConstructParams,
} from '../definition';
import MetaHelper from './metaHelper';
import { Resource } from './inject';
import HandlerMethod from 'mvc/handler_method';

enum Methods {
  'GET',
  'POST',
  'HEAD',
  'PUT',
  'DELETE',
  'CONNECT',
  'OPTIONS',
  'TRACE',
  'PATCH',
}
interface MvcMeta {
  [method: string]: {
    info: RequestInfo;
    args: Resolver[];
  };
}
// getBean()
// [(req,)]
//   0: (req, info, modelAndVIew) => info.getPath('0')

const beanMetaKey = Symbol('__inject beanDefinition');
const helper = new MetaHelper<BeanMeta>(beanMetaKey);

const Controller = (ctr: any) => {
  Resource({ type: 'single', isController: true })(ctr);
  for (const each of Methods) {
    const handlerMethod = new HandlerMethod(
      beanName,
      each.argsResolvers,
      each.returnValueResolvers,
    );
    RequestMapping.regist(each.info, handlerMethod);
  }
};
const RequestMapping = ({
  path,
  method,
  consumes,
  produces,
}: {
  path: string;
  method: keyof typeof Methods;
  consumes: string;
  produces: string;
}) => (ctr: any, methodName?: string) => {
  if (methodName) {
    ctr = ctr.constructor;
  }
};

export { Controller, helper, AutoInjectConstruct };
