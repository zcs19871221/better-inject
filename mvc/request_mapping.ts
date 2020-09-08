import { IncomingMessage } from 'http';
import HandlerMethod from './handler_method';
import RequestMappingInfo from './request_mapping_info';
import { helper, ArgsResolverInfo } from './annotation';
import { ServerResponse } from 'http';

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
    return handler;
  }

  regist(bean: any, beanClass: any) {
    const mvcMeta = helper.get(beanClass);
    if (!mvcMeta) {
      return;
    }
    const { methods, modelIniter, converters } = mvcMeta;
    Object.entries(methods).forEach(
      ([beanMethod, { info, argsResolverInfo, returnValueResolvers }]) => {
        if (!info) {
          throw new Error(beanMethod + '不存在info');
        }
        const key = info.hashCode();
        if (this.infoKeySet.has(key)) {
          throw new Error('重复定义拦截条件:' + key);
        }
        const matcher: [RequestMappingInfo, HandlerMethod] = [
          info,
          this.createHandlerMethod({
            argsResolverInfo,
            returnValueResolvers,
            beanClass,
            beanMethod,
            bean,
            modelIniter,
            converters,
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

  private createHandlerMethod({
    argsResolverInfo,
    returnValueResolvers,
    beanClass,
    beanMethod,
    bean,
    modelIniter,
    converters,
  }: {
    argsResolverInfo: ArgsResolverInfo[];
    beanClass: any;
    beanMethod: string;
  }): HandlerMethod {
    const params: any[] = Reflect.getMetadata(
      'design:paramtypes',
      beanClass.prototype,
      beanMethod,
    );
    const argsInfos = [...argsResolverInfo];
    params.forEach((each, index) => {
      if (argsResolverInfo.find(e => e.index === index)) {
        return;
      }
      if (each instanceof IncomingMessage) {
        argsInfos.push({
          type: 'request',
          index,
        });
      }
      if (each instanceof ServerResponse) {
        argsInfos.push({
          type: 'response',
          index,
        });
      }
      if (each === Map) {
        argsInfos.push({
          type: 'model',
          index,
        });
      }
    });
    return new HandlerMethod({
      argsResolverInfo,
      returnValueResolvers,
      beanClass,
      beanMethod,
      bean,
      modelIniter,
      converters,
    });
  }
}
