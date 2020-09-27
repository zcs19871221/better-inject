import RequestMappingInfo from './mvc/request_mapping_info';

declare module 'http' {
  interface IncomingMessage {
    params: { [key: string]: string | string[] };
    requestMappingInfo: RequestMappingInfo;
    body?: Buffer;
  }
}
