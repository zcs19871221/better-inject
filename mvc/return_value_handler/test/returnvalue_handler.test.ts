import { Server } from 'http';
import Request from 'better-request';
import http from 'http';
import Context from '../../../context';
import RequestMapping from '../../handle_request_mapping';
import Webrequest from '../../webrequest';

const context = new Context({
  scanFiles: 'mvc/return_value_handler/test/*_ex.ts',
});

const bean = <RequestMapping>context.getBean('REQUEST_MAPPING');
let server: Server;
const port = 9225;
const host = `localhost:${port}`;
const serverPath = `http://${host}`;
beforeAll(() => {
  server = http
    .createServer(async (req, res) => {
      const handler = bean.getHandler(req);
      try {
        await handler.handle(new Webrequest(req, res));
        return res.end('');
      } catch (error) {
        return res.end(error.message);
      }
    })
    .listen(port);
});
afterAll(() => {
  server.close();
});
it('response json', async () => {
  const res = await Request.fetch(
    {
      url: `${serverPath}/responseJson`,
      method: 'GET',
      header: {
        'content-type': 'application/json',
      },
      responseHandlers: [],
    },
    null,
  );
  expect(JSON.parse(String(res))).toEqual({
    name: 'zcs',
  });
});
it('response body', async () => {
  const res = await Request.fetch(
    {
      url: `${serverPath}/responseBuffer`,
      method: 'GET',
      responseHandlers: [],
    },
    null,
  );
  expect(String(res)).toBe('a buffer');
});
it('response body string', async () => {
  const res = await Request.fetch(
    {
      url: `${serverPath}/responseString`,
      method: 'GET',
      responseHandlers: [],
    },
    null,
  );
  expect(String(res)).toBe('a string');
});
it('response header', async () => {
  const req = new Request({
    url: `${serverPath}/responseHeader`,
    method: 'GET',
    responseHandlers: [],
  });
  await req.fetch(null);
  expect((<any>req.fetcher.getResHeader())['content-type']).toBe('text/plain');
  expect(req.fetcher.getResHeader()['date']).toBe('1602739429672');
});
it('response status', async () => {
  const req = new Request({
    url: `${serverPath}/response404`,
    method: 'GET',
    responseHandlers: [],
  });
  await req.fetch(null);
  expect(<any>req.fetcher.statusCode).toBe(404);
});
