import { ClientRequest } from 'http';
import PathParser from './path_parser';
import ContentTypeParser from './content_type_parser';
import AcceptParser from './accept_parser';

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
export default class RequestMappingInfo {
  private path: PathParser;
  private method: METHOD;
  private accept: AcceptParser;
  private contentType: ContentTypeParser;
  constructor({
    path,
    method = 'GET',
    accept = '',
    contentType = '',
  }: {
    path: string;
    method: METHOD;
    accept: string;
    contentType: string;
  }) {
    this.method = method;
    this.path = new PathParser(path);
    this.accept = new AcceptParser(accept);
    this.contentType = new ContentTypeParser(contentType);
  }

  match(request: ClientRequest) {
    return (
      this.path.match(request) &&
      this.accept.match(request) &&
      this.contentType.match(request)
    );
  }
}
