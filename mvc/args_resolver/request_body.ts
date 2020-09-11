import { IncomingMessage } from 'http';
import iconvLite from 'iconv-lite';
import ArgsResolver, { ResolveArgs } from './args_resolver';
import helper from '../annotation/helper';
import { parse } from '../queryString';

class RequestBody implements ArgsResolver {
  private index: number;
  private targetType: String | Buffer | Object;

  constructor(index: number, type: String | Buffer | Object) {
    this.index = index;
    this.targetType = type;
  }

  resolve(input: ResolveArgs): Promise<any> {
    return new Promise((resolve, reject) => {
      const buf: Buffer[] = [];
      let len: number = 0;
      const req = input.req;
      req.on('data', (chunk: Buffer) => {
        buf.push(chunk);
        len += chunk.length;
      });
      req.on('end', () => {
        try {
          const result: Buffer = Buffer.concat(buf, len);
          if (this.targetType === String) {
            return resolve(this.Buffer2String(req, result));
          }
          if (this.targetType === Buffer) {
            return resolve(result);
          }
          return resolve(this.Buffer2Object(req, result));
        } catch (error) {
          reject(error);
        }
      });
    });
  }

  private getContentType(req: IncomingMessage) {
    return req.headers['content-type'] || '';
  }
  private Buffer2String(req: IncomingMessage, result: Buffer): string {
    const contentType = this.getContentType(req);
    if (contentType) {
      const _tmp = /charset=(.*?)($|;)/iu.exec(contentType);
      const charset = (_tmp && _tmp[1] ? _tmp[1] : 'utf-8').trim();
      if (charset.toLowerCase() !== 'utf-8') {
        return iconvLite.decode(result, charset);
      }
    }
    return String(result);
  }

  private Buffer2Object(req: IncomingMessage, result: Buffer): any {
    const body = this.Buffer2String(req, result);
    const contentType = this.getContentType(req);
    if (contentType.includes('application/json')) {
      return JSON.parse(body);
    }
    if (contentType.includes('application/x-www-form-urlencoded')) {
      return parse(body);
    }
    return body;
  }

  getIndex() {
    return this.index;
  }
}
export const Annotation = (ctr: any, methodName: string, index: number) => {
  const mvcMeta = helper.getIfNotExisisInit(ctr, true);
  const methodMeta = helper.getOrInitMethodData(mvcMeta, methodName);
  const type = helper.getMethodParamTypes(ctr, methodName, index);
  if (![Buffer, Object, String].includes(type)) {
    throw new Error('RequestBody注入类型必须是Buffer Object String 之一');
  }
  methodMeta.argsResolver.push(new RequestBody(index, type));
  helper.set(ctr, mvcMeta);
};

export default RequestBody;
