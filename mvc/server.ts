import http, { Server } from 'http';
import Dispatcher from './dispatcher';
import Context from '../';

interface Config {
  port: number;
}

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

  start() {
    this.server = http
      .createServer((req, res) => {
        this.dispatcher.doDispatch(req, res);
      })
      .listen(this.config.port);
    this.server.on('error', () => {
      this.stop();
    });
  }

  stop() {
    if (this.server) {
      this.server.close();
    }
  }
}
