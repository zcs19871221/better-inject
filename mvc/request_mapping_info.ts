import { IncomingMessage } from 'http';
import { RequestCondition } from './condition/request_condition';
import RequestPathCondition from './condition/request_path_condition';
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
  headers?: string;
  params?: string;
  type: 'init';
}
interface RequestMappingInfoArgsFilterd {
  pathCondition: RequestPathCondition;
  methodCondition: RequestMethodCondition;
  acceptCondition: RequestAcceptCondition;
  contentTypeCondition: RequestContentTypeCondition;
  headerCondition: RequestHeaderCondition;
  paramCondition: RequestParamCondition;
  type: 'filterd';
}
type OPT = RequestMappingInfoArgs | RequestMappingInfoArgsFilterd;
export { RequestMappingInfoArgs };
export default class RequestMappingInfo
  implements RequestCondition<RequestMappingInfo> {
  private pathCondition: RequestPathCondition;
  private methodCondition: RequestMethodCondition;
  private acceptCondition: RequestAcceptCondition;
  private contentTypeCondition: RequestContentTypeCondition;
  private headerCondition: RequestHeaderCondition;
  private paramCondition: RequestParamCondition;
  constructor(args: OPT) {
    if (args.type === 'init') {
      this.pathCondition = new RequestPathCondition(this.wrapArgs(args.path));
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
      this.headerCondition = new RequestHeaderCondition(args.headers || '');
      this.paramCondition = new RequestParamCondition(args.params || '');
    } else {
      this.pathCondition = args.pathCondition;
      this.methodCondition = args.methodCondition;
      this.acceptCondition = args.acceptCondition;
      this.contentTypeCondition = args.contentTypeCondition;
      this.headerCondition = args.headerCondition;
      this.paramCondition = args.paramCondition;
    }
  }

  isEmpty() {
    return (
      this.pathCondition.isEmpty() &&
      this.methodCondition.isEmpty() &&
      this.acceptCondition.isEmpty() &&
      this.contentTypeCondition.isEmpty() &&
      this.headerCondition.isEmpty() &&
      this.paramCondition.isEmpty()
    );
  }

  hashCode() {
    return [
      this.pathCondition.hashCode(),
      this.methodCondition.hashCode(),
      this.paramCondition.hashCode(),
      this.headerCondition.hashCode(),
      this.contentTypeCondition.hashCode(),
      this.acceptCondition.hashCode(),
    ]
      .filter(e => e)
      .join(' && ');
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

  getPathCondition() {
    return this.pathCondition;
  }

  getMatchingCondition(req: IncomingMessage) {
    const methods = this.methodCondition.getMatchingCondition(req);
    if (methods === null) {
      return null;
    }
    const urls = this.pathCondition.getMatchingCondition(req);
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
      pathCondition: urls,
      methodCondition: methods,
      acceptCondition: accepts,
      contentTypeCondition: contentTypes,
      headerCondition: headers,
      paramCondition: params,
    });
  }

  combine(other: RequestMappingInfo) {
    return new RequestMappingInfo({
      type: 'filterd',
      pathCondition: <RequestPathCondition>(
        this.pathCondition.combine(other.pathCondition)
      ),
      methodCondition: this.methodCondition.combine(other.methodCondition),
      acceptCondition: this.acceptCondition.combine(other.acceptCondition),
      contentTypeCondition: this.contentTypeCondition.combine(
        other.contentTypeCondition,
      ),
      headerCondition: this.headerCondition.combine(other.headerCondition),
      paramCondition: this.paramCondition.combine(other.paramCondition),
    });
  }

  compareTo(other: RequestMappingInfo, req: IncomingMessage) {
    let res: number;
    res = this.pathCondition.compareTo(other.pathCondition);
    if (res !== 0) {
      return res;
    }
    res = this.methodCondition.compareTo(other.methodCondition);
    if (res !== 0) {
      return res;
    }
    res = this.paramCondition.compareTo(other.paramCondition);
    if (res !== 0) {
      return res;
    }
    res = this.headerCondition.compareTo(other.headerCondition);
    if (res !== 0) {
      return res;
    }
    res = this.contentTypeCondition.compareTo(other.contentTypeCondition);
    if (res !== 0) {
      return res;
    }
    res = this.acceptCondition.compareTo(other.acceptCondition, req);
    if (res !== 0) {
      return res;
    }
    if (res !== 0) {
      return res;
    }
    return 0;
  }
}
