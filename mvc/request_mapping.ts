import { IncomingMessage } from 'http';
import HandlerMethod from './handler_method';
import RequestMappingInfo from './request_mapping_info';
import { helper } from './annotation';

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
      throw new Error('请求条件：' + req.url + req.method + '没有匹配拦截器');
    }
    matched.sort((a, b) => {
      return a[0].compareTo(b[0]);
    });
    if (
      matched[0] &&
      matched[1] &&
      matched[0][0].compareTo(matched[1][0]) === 0
    ) {
      throw new Error(
        `请求url${
          req.url
        }匹配了两个相同的条件,对应方法：${matched[0][1].getMethod()}${matched[1][1].getMethod()}`,
      );
    }
    return matched[0][1];
  }

  regist(bean: any, beanClass: any) {
    const mvcMeta = helper.get(beanClass);
    if (!mvcMeta) {
      return;
    }
    Object.entries(mvcMeta).forEach(
      ([beanMethod, { info, argsResolvers, returnValueResolvers }]) => {
        const key = info.hashCode();
        if (this.infoKeySet.has(key)) {
          throw new Error('重复定义拦截条件:' + key);
        }
        const matcher: [RequestMappingInfo, HandlerMethod] = [
          info,
          new HandlerMethod({
            bean,
            beanMethod,
            argsResolvers,
            returnValueResolvers,
          }),
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
      },
    );
  }
}
