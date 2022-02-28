import http, { Server } from 'http';
import https from 'https';
import Dispatcher from './dispatcher';
import Context from '../';

type Config = (
  | { isHttps: true; key: Buffer; cert: Buffer }
  | { isHttps?: undefined }
) & { port: number };

let seq = 1;
export default class MvcServer {
  private context: Context;
  private config: Config;
  private server: Server | null = null;
  private dispatcher: Dispatcher;
  constructor(context: Context, config: Config) {
    this.context = context;
    this.config = config;
    this.dispatcher = new Dispatcher(this.context);
  }

  start(onStart: (config: Config) => any = () => {}) {
    if (this.config.isHttps) {
      this.server = https
        .createServer(
          { key: this.config.key, cert: this.config.cert },
          (req, res) => {
            (req as any).seq = seq;
            console.time('req' + seq++);
            this.dispatcher.doDispatch(req, res);
          },
        )
        .listen(this.config.port, () => {
          onStart(this.config);
        });
    } else {
      this.server = http
        .createServer((req, res) => {
          (req as any).seq = seq;
          console.time('req' + seq++);
          this.dispatcher.doDispatch(req, res);
        })
        .listen(this.config.port, () => {
          onStart(this.config);
        });
    }

    this.server.on('error', e => {
      console.error(e);
      this.stop();
    });
  }

  stop() {
    if (this.server) {
      this.server.close();
    }
  }
}
