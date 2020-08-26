export default class RequestMappingInfo {
  constructor({
    path,
    method = 'GET',
    consumes = '',
    produces = '',
  }: {
    path: string;
    method: keyof typeof Methods;
    consumes: string;
    produces: string;
  }) {}
}
