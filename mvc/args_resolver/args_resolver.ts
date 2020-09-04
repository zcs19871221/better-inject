import { IncomingMessage } from 'http';
export interface ArgsInfo {
  methodName: string;
  methodType: any;
  methodIndex: number;
}
export default interface Resolver<T> {
  (
    parameterInfo: ArgsInfo,
    model: Map<string, any>,
    request: IncomingMessage,
    args: T,
  ): any;
}
