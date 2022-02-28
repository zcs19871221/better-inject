import { IncomingMessage, ServerResponse } from 'http';
import { Readable } from 'stream';

export default class WebRequest {
  private req: IncomingMessage;
  private res: ServerResponse;
  private statusCode: number = 200;
  private resHeader: { [key: string]: string | number } = {};
  private hasResponse: boolean = false;
  constructor(req: IncomingMessage, res: ServerResponse) {
    this.req = req;
    this.res = res;
  }

  isRequestHandled(): boolean {
    return this.hasResponse;
  }

  setHasResponse() {
    this.hasResponse = true;
  }

  async response(value: string | Buffer | Readable): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.hasResponse) {
        return resolve();
      }
      this.hasResponse = true;
      this.res.on('error', error => {
        reject(error);
      });
      this.res.on('finish', () => {
        resolve();
      });
      this.res.statusCode = this.statusCode;
      if (!this.resHeader['content-type'] && this.req.headers['content-type']) {
        this.setHeader({
          'content-type': String(this.req.headers['content-type']),
        });
      }
      if (typeof value === 'string' || Buffer.isBuffer(value)) {
        this.setContentLength(value);
        this.writeHeader();
        return this.res.end(value);
      } else {
        this.writeHeader();
      }
      value.pipe(this.res);
    });
  }

  private parseContentType(contentType: string) {
    let mediaType = ';';
    let charset = '';
    let boundary = '';
    contentType
      .trim()
      .split(';')
      .forEach(part => {
        part = part.trim();
        if (part.includes('/')) {
          mediaType = part;
        } else if (part.includes('charset=')) {
          charset = part.slice(part.indexOf('charset=') + 'charset='.length);
        } else if (part.includes('boundary=')) {
          boundary = part.slice(part.indexOf('boundary=') + 'boundary='.length);
        }
      });
    return { mediaType, charset, boundary };
  }

  getResponseHeader(key: string) {
    return this.resHeader[key];
  }
  // private stringContentType({
  //   mediaType,
  //   charset,
  //   boundary,
  // }: {
  //   mediaType: string;
  //   charset: string;
  //   boundary: string;
  // }) {
  //   let res = '';
  //   if (mediaType) {
  //     res += mediaType;
  //   }
  //   if (charset) {
  //     res += '; charset=' + charset;
  //   }
  //   if (boundary) {
  //     res += '; boundary=' + boundary;
  //   }
  //   return res;
  // }

  clear() {
    this.statusCode = 200;
    this.resHeader = {};
  }

  setContentType(contentType: string) {
    this.setHeader({
      'content-type': contentType,
    });
  }

  private setContentLength(body: string | Buffer) {
    this.setHeader({
      'content-length': String(Buffer.byteLength(body)),
    });
  }

  getRequestMethod(): string {
    return <string>this.req.method;
  }

  canSetHeader(): boolean {
    return this.res.headersSent === false;
  }

  setHeader(header: { [key: string]: string | number }) {
    this.resHeader = { ...this.resHeader, ...header };
  }

  private writeHeader() {
    Object.entries(this.resHeader).forEach(([key, value]) => {
      this.res.setHeader(key, value);
    });
  }

  setStatusCode(statusCode: number) {
    this.statusCode = statusCode;
  }

  getResponse() {
    return this.res;
  }

  getRequest() {
    return this.req;
  }

  getRequestHeaderMap(): Map<string, string[] | string> {
    const map: any = new Map(
      Object.entries(this.req.headers).filter(e => e[1] !== undefined),
    );
    return map;
  }

  getRequestParamMap(): Map<string, string[] | string> {
    return new Map(Object.entries(this.req.params));
  }

  getContentType(): {
    mediaType: string;
    charset: string;
    boundary: string;
  } {
    return this.parseContentType(this.getRequestHeader('content-type'));
  }

  private getKeys(key: string): string[] {
    key = key.trim();
    const keys = [key, key.toLowerCase()];
    const linePos = key.indexOf('-');
    if (linePos > -1 && linePos !== 0 && linePos !== key.length - 1) {
      keys.push(
        key[0].toUpperCase() +
          key.slice(1, linePos) +
          '-' +
          key[linePos + 1] +
          key.slice(linePos + 2),
      );
    }
    return keys;
  }

  getRequestCookie(): Map<string, string | string[]> {
    const cookie = this.getRequestHeader('cookie');
    return cookie
      .split(';')
      .reduce((acc: Map<string, string | string[]>, each: string) => {
        each = each.trim();
        const [name, value] = each.split('=');
        if (name !== undefined && value !== undefined) {
          const mapValue = acc.get(name);
          if (mapValue === undefined) {
            acc.set(name, value);
          } else {
            if (Array.isArray(mapValue)) {
              mapValue.push(value);
            } else {
              acc.set(name, [mapValue, value]);
            }
          }
        }
        return acc;
      }, new Map());
  }

  getRequestHeader(headerKey: string): string {
    const keys = this.getKeys(headerKey);
    let target: string = '';
    for (const key of keys) {
      const header = this.req.headers[key];
      if (header !== undefined) {
        if (Array.isArray(header)) {
          target = header.join(';');
        } else {
          target = header;
        }
        break;
      }
    }
    return target;
  }

  isReqContentTypeJson() {
    if (this.req.headers['content-type']) {
      return this.req.headers['content-type']?.includes('application/json');
    }
    return false;
  }
}
