import { readFileSync } from 'fs';
import path from 'path';
import Context, { Server } from '../';

const context = new Context({
  scanFiles: ['manga/controller.ts'],
});

const port = 8000;
const server: Server = new Server(context, {
  port,
  isHttps: true,
  key: readFileSync(path.join(process.cwd(), 'localhost+3-key.pem')),
  cert: readFileSync(path.join(process.cwd(), 'localhost+3.pem')),
});
server.start((config: any) => console.log('server start at ' + config.port));
