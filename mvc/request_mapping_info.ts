import { IncomingMessage } from 'http';
import RequestCondition from './condition/request_condition';
import RequestUrlCondition from './condition/request_url_condition';
import RequestMethodCondition, {
  METHOD,
} from './condition/request_method_condition';
import RequestContentTypeCondition from './condition/reqeust_content_type_condition';
import RequestAcceptCondition from './condition/reqeust_accept_condition';
import RequestHeaderCondition from './condition/request_header_condition';
import RequestParamCondition from './condition/request_param_condition';

type OneOrList<T> = T | T[];
interface RequestMappingInfoArgs {
  path?: OneOrList<string>;
  method?: OneOrList<METHOD>;
  accept?: OneOrList<string>;
  contentType?: OneOrList<string>;
  headers?: OneOrList<string>;
  params?: OneOrList<string>;
  type: 'init';
}
interface RequestMappingInfoArgsFilterd {
  pathCondition: RequestUrlCondition;
  methodCondition: RequestMethodCondition;
  acceptCondition: RequestAcceptCondition;
  contentTypeCondition: RequestContentTypeCondition;
  headerCondition: RequestHeaderCondition;
  paramCondition: RequestParamCondition;
  hashKey: string;
  type: 'filterd';
}
type OPT = RequestMappingInfoArgs | RequestMappingInfoArgsFilterd;
export { RequestMappingInfoArgs };
export default class RequestMappingInfo {
  private urlCondition: RequestUrlCondition;
  private methodCondition: RequestMethodCondition;
  private acceptCondition: RequestAcceptCondition;
  private contentTypeCondition: RequestContentTypeCondition;
  private headerCondition: RequestHeaderCondition;
  private paramCondition: RequestParamCondition;
  private hashKey: string;
  constructor(args: OPT) {
    if (args.type === 'init') {
      this.urlCondition = new RequestUrlCondition(this.wrapArgs(args.path));
      this.methodCondition = new RequestMethodCondition(
        Array.isArray(args.method)
          ? args.method
          : args.method
          ? [args.method]
          : [],
      );
      this.acceptCondition = new RequestAcceptCondition(
        this.wrapArgs(args.accept),
      );
      this.contentTypeCondition = new RequestContentTypeCondition(
        this.wrapArgs(args.contentType),
      );
      this.headerCondition = new RequestHeaderCondition(
        this.wrapArgs(args.headers),
      );
      this.paramCondition = new RequestParamCondition(
        this.wrapArgs(args.params),
      );
      this.hashKey = this.generateKey();
    } else {
      this.urlCondition = args.pathCondition;
      this.methodCondition = args.methodCondition;
      this.acceptCondition = args.acceptCondition;
      this.contentTypeCondition = args.contentTypeCondition;
      this.headerCondition = args.headerCondition;
      this.paramCondition = args.paramCondition;
      this.hashKey = args.hashKey;
    }
  }

  private generateKey() {
    return this.urlCondition.hashCode() + this.methodCondition.hashCode() + this.acceptCondition.hashCode() + this.contentTypeCondition.hashCode() + this.headerCondition.hashCode() + this.paramCondition.hashCode()
  }
  private wrapArgs(value: string | string[] | undefined) {
    if (value === undefined) {
      return [];
    }
    if (!Array.isArray(value)) {
      value = value.trim();
      if (!value) {
        return [];
      }
      return [value];
    }
    return value;
  }

  // private isNewArgs() {}

  // compareTo(other: RequestCondition, req: IncomingMessage) {
  //   return this;
  // }

  getMatchingCondition(req: IncomingMessage) {
    const methods = this.methodCondition.getMatchingCondition(req);
    if (methods === null) {
      return null;
    }
    const urls = this.urlCondition.getMatchingCondition(req);
    if (urls === null) {
      return null;
    }
    const accepts = this.acceptCondition.getMatchingCondition(req);
    if (accepts === null) {
      return null;
    }
    const contentTypes = this.contentTypeCondition.getMatchingCondition(req);
    if (contentTypes === null) {
      return null;
    }
    const headers = this.headerCondition.getMatchingCondition(req);
    if (headers === null) {
      return null;
    }
    const params = this.paramCondition.getMatchingCondition(req);
    if (params === null) {
      return null;
    }
    return new RequestMappingInfo({
      type: 'filterd',
      pathCondition: <RequestUrlCondition>urls,
      methodCondition: <RequestMethodCondition>methods,
      acceptCondition: <RequestAcceptCondition>accepts,
      contentTypeCondition: <RequestContentTypeCondition>contentTypes,
      headerCondition: <RequestHeaderCondition>headers,
      paramCondition: <RequestParamCondition>params,
      hashKey: this.hashKey,
    });
  }

  combine(other:RequestMappingInfo) {
       return new RequestMappingInfo({
      type: 'filterd',
      pathCondition: <RequestUrlCondition>urls,
      methodCondition: <RequestMethodCondition,
      acceptCondition: <RequestAcceptCondition,
      contentTypeCondition: <RequestContentTypeCondition,
      headerCondition: <RequestHeaderCondition,
      paramCondition: <RequestParamCondition,
      hashKey: this.hashKey,
    });
  }
}
