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
      if (typeof value === 'string' || Buffer.isBuffer(value)) {
        return this.res.end(value);
      }
      value.pipe(this.res);
    });
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
}
