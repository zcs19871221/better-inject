import { Server } from 'http';
import Request from 'better-request';
import http from 'http';
import Context from '../../../context';
import RequestMapping from '../../handle_request_mapping';
import WebRequest from '../../webrequest';

const context = new Context({
  scanFiles: 'mvc/exception_handler/test/ex_test.ts',
});

const bean = <RequestMapping>context.getBean('REQUEST_MAPPING');
let server: Server;
const host = 'localhost:9330';
const serverPath = `http://${host}`;
beforeAll(() => {
  server = http
    .createServer(async (req, res) => {
      const handler = bean.getHandler(req);
      try {
        await handler.handle(new WebRequest(req, res));
        return res.end('');
      } catch (error) {
        return res.end(error.message);
      }
    })
    .listen(9330);
});
afterAll(() => {
  server.close();
});
it('execption handler', async () => {
  await Request.fetch(
    {
      url: `${serverPath}/errorHandler`,
      method: 'GET',
    },
    null,
  );
  const args = (<any>context.getBean('exceptionhandlercontroller')).args;
  expect(args.notExists).toEqual('');
});
it('execption handler2', async () => {
  await Request.fetch(
    {
      url: `${serverPath}/errorHandler`,
      search: {
        key: 'sbvds',
      },
      method: 'GET',
    },
    null,
  );
  const args = (<any>context.getBean('exceptionhandlercontroller')).args;
  expect(args.other).toEqual('');
});
