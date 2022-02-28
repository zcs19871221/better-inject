import iconvLite from 'iconv-lite';
import ParamResolver, {
  ResolveParamArgs,
  ParamAnnotationInfo,
  ParamInfo,
} from './resolver';
import { parse } from '../query_string';
import AnnotationFactory from './annotation_factory';

interface RequestBodyAnnotationInfo extends ParamAnnotationInfo {
  type: 'RequestBody';
}

export default class RequestBodyResolver
  implements ParamResolver<RequestBodyAnnotationInfo> {
  isSupport(paramInfo: ParamInfo) {
    return paramInfo.annotations.some(e => e.type === 'RequestBody');
  }

  guard(
    annotationInfo: ParamAnnotationInfo,
  ): annotationInfo is RequestBodyAnnotationInfo {
    return annotationInfo.type === 'RequestBody';
  }

  getAnnotationInfo(paramInfo: ParamInfo): null | RequestBodyAnnotationInfo {
    const t = paramInfo.annotations.filter(this.guard);
    if (t.length === 0) {
      return null;
    }
    return t[0];
  }

  async resolve(input: ResolveParamArgs): Promise<any> {
    const req = input.webRequest.getRequest();
    if (!req.body) {
      req.body = new Promise(resolve => {
        const buf: Buffer[] = [];
        let len: number = 0;
        const req = input.webRequest.getRequest();
        req.on('data', (chunk: Buffer) => {
          buf.push(chunk);
          len += chunk.length;
        });
        req.on('end', () => {
          const body: Buffer = Buffer.concat(buf, len);
          req.bodyLength = Buffer.byteLength(body);
          return resolve(body);
        });
      });
    }
    const body = await req.body;
    const { charset, mediaType } = input.webRequest.getContentType();
    return await this.handleBody(input, body, charset, mediaType);
  }

  private handleBody(
    input: ResolveParamArgs,
    body: Buffer,
    charset: string,
    mediaType: string,
  ) {
    if (input.param.type === Buffer) {
      return body;
    }
    const bodyStr = this.Buffer2String(body, charset);
    if (input.param.type === String) {
      return bodyStr;
    }
    if (mediaType.includes('application/json') && input.param.type === Object) {
      try {
        return JSON.parse(bodyStr);
      } catch (error) {
        return {};
      }
    }
    if (mediaType.includes('application/x-www-form-urlencoded')) {
      return parse(bodyStr);
    }
    return input.dataBinder.convert(bodyStr, input.param);
  }

  private Buffer2String(result: Buffer, charset: string): string {
    if (charset && charset.toLowerCase() !== 'utf-8') {
      return iconvLite.decode(result, charset);
    }
    return String(result);
  }
}
export const Annotation = (ctr: any, methodName: string, index: number) =>
  AnnotationFactory<RequestBodyAnnotationInfo>(ctr, methodName, index, {
    type: 'RequestBody',
  });
