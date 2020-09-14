import iconvLite from 'iconv-lite';
import ParamResolver, { ResolveParamArgs } from '.';
import helper from '../annotation/helper';
import { parse } from '../queryString';

export default class RequestBody implements ParamResolver {
  isSupport(input: ResolveParamArgs) {
    return input.paramInfo.annotations.some(e => e.type === 'RequestBody');
  }
  resolve(input: ResolveParamArgs): Promise<any> {
    return new Promise((resolve, reject) => {
      const buf: Buffer[] = [];
      let len: number = 0;
      const req = input.webRequest.getRequest();
      req.on('data', (chunk: Buffer) => {
        buf.push(chunk);
        len += chunk.length;
      });
      req.on('end', () => {
        try {
          const { charset, mediaType } = input.webRequest.getContentType();
          const result: Buffer = Buffer.concat(buf, len);
          if (input.paramInfo.type === String) {
            return resolve(this.Buffer2String(result, charset));
          }
          if (input.paramInfo.type === Buffer) {
            return resolve(result);
          }
          return resolve(this.Buffer2Object(result, mediaType, charset));
        } catch (error) {
          reject(error);
        }
      });
    });
  }

  private Buffer2String(result: Buffer, charset: string): string {
    if (charset.toLowerCase() !== 'utf-8') {
      return iconvLite.decode(result, charset);
    }
    return String(result);
  }

  private Buffer2Object(
    result: Buffer,
    mediaType: string,
    charSet: string,
  ): any {
    const body = this.Buffer2String(result, charSet);
    if (mediaType.includes('application/json')) {
      return JSON.parse(body);
    }
    if (mediaType.includes('application/x-www-form-urlencoded')) {
      return parse(body);
    }
    return body;
  }
}
export const Annotation = (ctr: any, methodName: string, index: number) => {
  const param = helper.getMethodParam(ctr, methodName)[index];
  if (![Buffer, Object, String].includes(param.type)) {
    throw new Error('RequestBody注入类型必须是Buffer Object String 之一');
  }
  const mvcMeta = helper.getIfNotExisisInit(ctr, true);
  const methodMeta = helper.getOrInitMethodData(mvcMeta, methodName);
  if (!methodMeta.paramInfos[index]) {
    methodMeta.paramInfos[index] = {
      ...param,
      annotations: [],
    };
  }
  methodMeta.paramInfos[index].annotations.push({
    type: 'RequestBody',
  });
  helper.set(ctr, mvcMeta);
};
