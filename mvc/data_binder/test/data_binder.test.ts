import { Server } from 'http';
import Request from 'better-request';
import http from 'http';
import Context from '../../../context';
import RequestMapping from '../../handle_request_mapping';
import { User } from './ex_test';

const context = new Context({
  scanFiles: 'mvc/data_binder/test/ex_test.ts',
});

const bean = <RequestMapping>context.getBean('REQUEST_MAPPING');
let server: Server;
const host = 'localhost:9224';
const serverPath = `http://${host}`;
beforeAll(() => {
  server = http
    .createServer(async (req, res) => {
      const handler = bean.getHandler(req);
      try {
        await handler.handle(req, res);
        return res.end('');
      } catch (error) {
        return res.end(error.message);
      }
    })
    .listen(9224);
});
afterAll(() => {
  server.close();
});
it('init binder', async () => {
  await Request.fetch(
    {
      url: `${serverPath}/initbinder`,
      method: 'GET',
      search: {
        publishTime: new Date('2020-10-10').getTime(),
        user: 'zcs',
      },
    },
    null,
  );
  const args = (<any>context.getBean('initbindercontroller')).args;
  expect(args).toEqual({
    publishTime: new Date('2020-10-10'),
    user: new User('zcs'),
  });
});
