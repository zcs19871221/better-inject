import 'reflect-metadata';
import { Server } from 'http';
import Request from 'better-request';
import iconv from 'iconv-lite';
import http from 'http';
import Context from '../../../context';
import RequestMapping from '../../handle_request_mapping';
import { ServerResponse, IncomingMessage } from 'http';
import ModelView from '../../model_view';
import WebRequest from '../../webrequest';

const context = new Context({
  scanFiles: 'mvc/param_resolver/test/ex_test.ts',
});

const bean = <RequestMapping>context.getBean('REQUEST_MAPPING');
let server: Server;
const host = 'localhost:9223';
const serverPath = `http://${host}`;
beforeAll(() => {
  server = http
    .createServer(async (req, res) => {
      const handler = bean.getHandler(req);
      try {
        await handler.handle(new WebRequest(req, res));
        return res.end('');
      } catch (error) {
        return res.end((error as Error).message);
      }
    })
    .listen(9223);
});
afterAll(() => {
  server.close();
});
it('cookie', async () => {
  await Request.fetch(
    {
      url: `${serverPath}/base/cookie`,
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
it('PathVariable', async () => {
  await Request.fetch(
    {
      url: `${serverPath}/pathvariable/first/gosecond.html`,
      method: 'GET',
    },
    null,
  );
  const args = (<any>context.getBean('paramresolvercontroller')).args;
  expect(args.pathVariable).toEqual({
    allPath: new Map(
      Object.entries({ base: 'pathvariable', sub: 'first', sub2: 'second' }),
    ),
    base: 'pathvariable',
    sub: 'first',
    sub2: 'second',
  });
});
it('requestheader', async () => {
  await Request.fetch(
    {
      url: `${serverPath}/base/requestHeader`,
      method: 'GET',
      header: {
        'content-type': 'text/plain',
        accept: '*',
        custom: 'any',
      },
    },
    null,
  );
  const args = (<any>context.getBean('paramresolvercontroller')).args;
  expect(args.requestHeader).toEqual({
    allHeader: new Map(
      Object.entries({
        'content-type': 'text/plain',
        accept: '*',
        custom: 'any',
        host,
        connection: 'keep-alive',
      }),
    ),
    contentType: 'text/plain',
    accept: '*',
  });
});
it('requestParam', async () => {
  await Request.fetch(
    {
      url: `${serverPath}/base/requestParam`,
      search: {
        name: 'zcs',
        id: '001',
        gender: 'male',
      },
      method: 'GET',
    },
    null,
  );
  const args = (<any>context.getBean('paramresolvercontroller')).args;
  expect(args.requestParam).toEqual({
    allParam: new Map(
      Object.entries({
        name: 'zcs',
        id: '001',
        gender: 'male',
      }),
    ),
    name: 'zcs',
    name2: 'zcs',
    id: '001',
  });
});
it('requestMethod', async () => {
  await Request.fetch(
    {
      url: `${serverPath}/base/requestMethod`,
      method: 'POST',
    },
    null,
  );
  const args = (<any>context.getBean('paramresolvercontroller')).args;
  expect(args.requestMethod).toBe('POST');
});
it('requestBody - application/json', async () => {
  await Request.fetch(
    {
      url: `${serverPath}/base/requestBody`,
      header: {
        'content-type': 'application/json',
      },
      method: 'POST',
    },
    JSON.stringify({ name: 'zcs', age: 18 }),
  );
  const args = (<any>context.getBean('paramresolvercontroller')).args;
  expect(args.body).toEqual({
    bodyBuffer: Buffer.from(JSON.stringify({ name: 'zcs', age: 18 })),
    bodyBuffer2: Buffer.from(JSON.stringify({ name: 'zcs', age: 18 })),
    body: { name: 'zcs', age: 18 },
  });
});

it('requestBody - application/x-www-form-urlencoded', async () => {
  await Request.fetch(
    {
      url: `${serverPath}/base/requestBody`,
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      method: 'POST',
    },
    'level=18&weapon=sword',
  );
  const args = (<any>context.getBean('paramresolvercontroller')).args;
  expect(args.bodyEncoded).toEqual({
    level: '18',
    weapon: 'sword',
  });
});

it('requestBody - decode gbkf accord charset', async () => {
  await Request.fetch(
    {
      url: `${serverPath}/base/requestBodyGbk`,
      header: {
        'content-type': 'application/json;charset=gbk',
      },
      method: 'POST',
    },
    iconv.encode('原始string', 'GBK'),
  );
  const args = (<any>context.getBean('paramresolvercontroller')).args;
  expect(args.decodeGbk).toBe('原始string');
});

it('typeParam', async () => {
  await Request.fetch(
    {
      url: `${serverPath}/base/typeParam`,
      method: 'GET',
    },
    null,
  );
  const args = (<any>context.getBean('paramresolvercontroller')).args;
  const type = args.typeParam;
  expect(type.req instanceof IncomingMessage).toBe(true);
  expect(type.res instanceof ServerResponse).toBe(true);
  expect((<ModelView>type.modelView).getModel()).toEqual(
    new Map([['name', 'zcs']]),
  );
  expect(type.wr instanceof WebRequest).toEqual(true);
});
