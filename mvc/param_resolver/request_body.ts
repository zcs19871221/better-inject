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
          if (input.param.type === String) {
            return resolve(this.Buffer2String(result, charset));
          }
          if (input.param.type === Buffer) {
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
export const Annotation = (ctr: any, methodName: string, index: number) =>
  AnnotationFactory<RequestBodyAnnotationInfo>([Buffer, Object, String])(
    ctr,
    methodName,
    index,
    {
      type: 'RequestBody',
    },
  );
