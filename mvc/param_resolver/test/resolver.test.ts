import 'reflect-metadata';
import { Server } from 'http';
import Request from 'better-request';
import http from 'http';
import Context from '../../../context';
import RequestMapping from '../../handle_request_mapping';

const context = new Context({
  scanFiles: 'mvc/param_resolver/test/ex_test.ts',
});

const bean = <RequestMapping>context.getBean('REQUEST_MAPPING');
let server: Server;
const serverPath = 'http://localhost:9223';
beforeAll(() => {
  server = http
    .createServer(async (req, res) => {
      const handler = bean.getHandler(req);
      await handler.handle(req, res);
      return res.end('');
    })
    .listen(9223);
});
afterAll(() => {
  server.close();
});
it('cookie', async () => {
  await Request.fetch(
    {
      url: `${serverPath}/cookie`,
      method: 'GET',
      header: {
        cookie: 'jsessionid=abcde; token=56789',
      },
    },
    null,
  );
  const args = (<any>context.getBean('paramresolvercontroller')).args;
  expect(args.cookie).toEqual({
    allCookie: new Map(Object.entries({ jsessionid: 'abcde', token: '56789' })),
    sessionid: 'abcde',
  });
});
