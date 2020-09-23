import path from 'path';
import http, { Server } from 'http';
import Context from '../context';
import RequestMapping from './handle_request_mapping';

const servers: Server[] = [];

afterEach(() => {
  servers.forEach(server => server.close());
});
it('handler', () => {
  const context = new Context({
    scanFiles: 'test/mvc/handler.ts',
    root: path.join(__dirname, '../'),
  });

  const bean = <RequestMapping>context.getBean('REQUEST_MAPPING');
  const handler = bean['mapping'][0][1];
  const server = http
    .createServer((req, res) => {
      const returnValue = handler.handle(req, res);
      expect((<any>context.getBean('usercontroller'))['args']).toEqual([]);
      expect(returnValue).toEqual([]);
      return res.end('');
    })
    .listen(9222);
  servers.push(server);
  const req = http.request('http://localhost:9222/', {
    method: 'GET',
    headers: {},
  });
  req.end('');
});
