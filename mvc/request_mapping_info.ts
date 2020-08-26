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
  private method: METHOD;
  constructor({
    path,
    method = 'GET',
    consumes = '',
    produces = '',
  }: {
    path: string;
    method: METHOD;
    consumes: string;
    produces: string;
  }) {
    this.method = method;
    this.path = new PathResolver(path);
    this.consume = new ConsumeParser();
    this.produce = new ProduceParser();
  }

  match(request: HttpCLi) {
    return this.PathResolver;
  }
}
interface InfoParser {
  match(input: req): boolean;
}
class PathResolver {
  resolve() {}
}
