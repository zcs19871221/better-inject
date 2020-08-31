import { IncomingMessage } from 'http';
import HandlerMethod from './handler_method';
import RequestMappingInfo from './request_mapping_infots';
import { helper } from '../annotation/mvc';

export default class RequestMapping {
  private mapping: [RequestMappingInfo, HandlerMethod][] = [];
  private infoKeySet: Set<string> = new Set();

  static beanId: string = 'REQUEST_MAPPING';
  getHandler(req: IncomingMessage): HandlerMethod {
    const filterd = this.mapping.filter(each => each[0].match(req));
    if (!filterd) {
      throw new Error('请求条件：' +req.url + req.method + '没有配置拦截器')
    }
    filterd.sort((a, b) => {
      a[0].
    })
    return filterd[0][1]
  }



  regist(bean: any, beanClass: any) {
    const mvcMeta = helper.get(beanClass);
    Object.entries(mvcMeta).forEach(
      ([beanMethod, { info, argsResolvers, returnValueResolvers }]) => {
        const condition = info.getCondition();
        if (this.infoKeySet.has(condition)) {
          throw new Error('重复定义拦截条件:' + condition);
        }
        this.infoKeySet.add(condition);
        this.mapping.push([
          info,
          new HandlerMethod({
            bean,
            beanMethod,
            argsResolvers,
            returnValueResolvers,
          }),
        ]);
      },
    );
  }
}
