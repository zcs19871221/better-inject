import 'reflect-metadata';
import http from 'http';
import Context from '../../../context';
import RequestMapping from '../../handle_request_mapping';
import { Server } from 'http';
import Request from 'better-request';
import User from './user';
import WebRequest from '../../webrequest';

const context = new Context({
  scanFiles: 'mvc/model_attribute/test/model_attribute_test.ts',
});

const bean = <RequestMapping>context.getBean('REQUEST_MAPPING');
let server: Server;
beforeAll(() => {
  server = http
    .createServer(async (req, res) => {
      const handler = bean.getHandler(req);
      await handler.handle(new WebRequest(req, res));
      return res.end('');
    })
    .listen(9222);
});
afterAll(() => {
  server.close();
});
it('model_attribute', async () => {
  await Request.fetch(
    {
      url: 'http://localhost:9222/user/zcs/get?name=张成思',
      method: 'GET',
      header: {
        id: 'a1',
        custom: 'er',
      },
    },
    null,
  );
  expect((<any>context.getBean('usercontroller')).args).toEqual({
    age: 13,
    user: new User('a1', '张成思', 'zcs'),
    genderModel: '男er',
  });
});
