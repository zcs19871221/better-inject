import { IncomingMessage } from 'http';
import HandlerMethod from './handler_method';
import RequestMappingInfo from './request_mapping_info';
import helper from './meta_helper';
import BeanFactory from '../factory';
import { parse } from './query_string';

export default class RequestMapping {
  private mapping: [RequestMappingInfo, HandlerMethod][] = [];
  private urlMapping: Map<
    string,
    [RequestMappingInfo, HandlerMethod][]
  > = new Map();
  private infoKeySet: Set<string> = new Set();
  static beanId: string = 'REQUEST_MAPPING';

  getHandler(req: IncomingMessage): HandlerMethod {
    const matched: [RequestMappingInfo, HandlerMethod][] = [];
    if (this.urlMapping.get(<string>req.url)) {
      matched.push(
        ...(<[RequestMappingInfo, HandlerMethod][]>(
          this.urlMapping.get(<string>req.url)
        )),
      );
    }
    if (!matched.length) {
      this.mapping.forEach(each => {
        const matching = each[0].getMatchingCondition(req);
        if (matching !== null) {
          matched.push([matching, each[1]]);
        }
      });
    }
    if (matched.length === 0) {
      throw new Error(
        '请求条件：' + req.method + ' ' + req.url + '没有匹配拦截器',
      );
    }
    matched.sort((a, b) => {
      return a[0].compareTo(b[0], req);
    });
    if (
      matched[0] &&
      matched[1] &&
      matched[0][0].compareTo(matched[1][0], req) === 0
    ) {
      throw new Error(
        `请求url${
          req.url
        }匹配了两个相同的条件,对应方法：${matched[0][1].getMethod()}${matched[1][1].getMethod()}`,
      );
    }
    const [bestMppingInfo, handler] = matched[0];
    req.requestMappingInfo = bestMppingInfo;
    req.params = parse(req.url?.replace(/[^?]+\?/, ''));
    return handler;
  }

  regist(bean: any, beanClass: any, factory: BeanFactory) {
    const mvcMeta = helper.get(beanClass);
    if (!mvcMeta) {
      return;
    }
    const { methods, modelIniter, initBinder, execptionHandlerInfo } = mvcMeta;
    Object.entries(methods).forEach(([beanMethod, methodMeta]) => {
      const info = methodMeta.mappingInfo;
      if (!info) {
        return;
      }
      const key = info.hashCode();
      if (this.infoKeySet.has(key)) {
        throw new Error('重复定义拦截条件:' + key);
      }
      const value = {
        ...methodMeta,
        modelIniter,
        initBinder,
        beanMethod,
        bean,
        execptionHandlerInfo,
      };
      delete value.mappingInfo;
      const matcher: [RequestMappingInfo, HandlerMethod] = [
        info,
        new HandlerMethod(value, factory),
      ];
      this.infoKeySet.add(key);
      info
        .getPathCondition()
        .filterPureUrl()
        .forEach(url => {
          if (!this.urlMapping.has(url)) {
            this.urlMapping.set(url, []);
          }
          this.urlMapping.get(url)?.push(matcher);
        });
      this.mapping.push(matcher);
    });
  }
}
