import { IncomingMessage } from 'http';
import InfoParser from './condition/request_condition';
import PathParser from './condition/request_url_condition';
import AcceptParser from './condition/accept_parser';
import ContentTypeParser from './condition/content_type_parser';
import { HeaderParser, ParamParser } from './condition/header_param_parser';

enum HTTP_METHOD {
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
type METHOD = keyof typeof HTTP_METHOD;
type OneOrList<T> = T | T[];
interface RequestMappingInfoArgs {
  path: OneOrList<string>;
  method?: OneOrList<METHOD>;
  accept?: OneOrList<string>;
  contentType?: OneOrList<string>;
  headers?: string;
  params?: string;
}
export { RequestMappingInfoArgs };
export default class RequestMappingInfo implements InfoParser {
  private path: PathParser;
  private method: METHOD[];
  private accept: AcceptParser;
  private contentType: ContentTypeParser;
  private header: HeaderParser;
  private param: ParamParser;
  constructor({
    path,
    method = [],
    accept = [],
    contentType = [],
    headers = '',
    params = '',
  }: RequestMappingInfoArgs) {
    this.method = this.wrapArray(method);
    this.method.sort();
    this.path = new PathParser(this.wrapArray(path));
    this.accept = new AcceptParser(this.wrapArray(accept));
    this.contentType = new ContentTypeParser(this.wrapArray(contentType));
    this.header = new HeaderParser(headers ? headers.split(';') : []);
    this.param = new ParamParser(params ? params.split(';') : []);
  }

  private wrapArray<T>(value: T | T[]): T[] {
    if (!Array.isArray(value)) {
      return [value];
    }
    return value;
  }

  compare(other: RequestMappingInfo, req: IncomingMessage) {
    let res: number = 0;
    res = this.path.compare(other, req);
    if (res !== 0) {
      return res;
    }
  }

  getMatchingCondition(request: IncomingMessage) {
    const pathObj = this.path.getMatchingCondition(request);
    if (!pathObj) {
      return null;
    }
    const method = this.method.filter((<any>request.method).toUpperCase());
    if ()
    const contentType = this.contentType.getMatchingCondition(request)
    return new RequestMappingInfo(key:this.getKey());
  }

  getKey() {
    return `path:${this.path.getCondition()} method:${this.method.join(
      ';',
    )} contentType:${this.contentType.getInput()} accept:${this.accept.getInput()}`;
  }

  merge(info: RequestMappingInfo) {
    this.path = this.path.merge(info.path);
    const m = [...new Set(info.method.concat(this.method))];
    m.sort();
    this.method = m;
    this.accept = this.accept.merge(info.accept);
    this.contentType = this.contentType.merge(info.contentType);
    this.header = this.header.merge(info.header);
    this.param = this.param.merge(info.param, this.path);
    return this;
  }
}
