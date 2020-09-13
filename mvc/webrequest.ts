import { IncomingMessage, ServerResponse } from 'http';
import { Readable } from 'stream';

export default class WebRequest {
  private req: IncomingMessage;
  private res: ServerResponse;
  constructor(req: IncomingMessage, res: ServerResponse) {
    this.req = req;
    this.res = res;
  }

  canResponse(): boolean {
    return this.res.writableEnded;
  }

  async response(value: string | Buffer | Readable) {
    return new Promise((resolve, reject) => {
      this.res.on('error', error => {
        reject(error);
      });
      this.res.on('finish', () => {
        resolve();
      });
      this.setDefaultContentType();
      if (typeof value === 'string' || Buffer.isBuffer(value)) {
        this.setDefaultContentLength(value);
        return this.res.end(value);
      }
      value.pipe(this.res);
    });
  }

  private setDefaultContentType() {
    if (this.canSetHeader() && !this.res.hasHeader('content-type')) {
      this.setHeader({
        'content-type': String(this.req.headers['content-type']),
      });
    }
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

  private stringContentType({
    mediaType,
    charset,
    boundary,
  }: {
    mediaType: string;
    charset: string;
    boundary: string;
  }) {
    let res = '';
    if (mediaType) {
      res += mediaType;
    }
    if (charset) {
      res += '; charset=' + charset;
    }
    if (boundary) {
      res += '; boundary]' + boundary;
    }
    return res;
  }

  setResponseContentType({
    mediaType = '',
    charset = '',
    boundary = '',
  }: {
    mediaType: string;
    charset: string;
    boundary: string;
  }) {
    const contentType = this.res.getHeader('content-type');
    if (contentType === undefined) {
      return mediaType;
    }
    const parsedContentType = this.parseContentType(String(contentType));
    return this.stringContentType({
      ...parsedContentType,
      ...(mediaType && { mediaType }),
      ...(charset && { charset }),
      ...(boundary && { boundary }),
    });
  }

  private setDefaultContentLength(body: string | Buffer) {
    if (this.canSetHeader() && !this.res.hasHeader('content-type')) {
      this.setHeader({
        'content-length': String(Buffer.byteLength(body)),
      });
    }
  }

  canSetHeader(): boolean {
    return this.res.headersSent === false;
  }

  setHeader(header: { [key: string]: string | number }) {
    Object.entries(header).forEach(([key, value]) => {
      this.res.setHeader(key, value);
    });
  }

  setStatusCode(statusCode: number) {
    this.res.statusCode = statusCode;
  }

  getResponse() {
    return this.res;
  }

  getRequest() {
    return this.req;
  }

  isReqContentTypeJson() {
    if (this.req.headers['content-type']) {
      return this.req.headers['content-type']?.includes('application/json');
    }
    return false;
  }
}
