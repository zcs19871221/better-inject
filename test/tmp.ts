import 'reflect-metadata';
import http from 'http';
import Context from '../context';
import RequestMapping from '../mvc/handle_request_mapping';

const context = new Context({
  scanFiles: 'test/mvc/handler.ts',
});

const bean = <RequestMapping>context.getBean('REQUEST_MAPPING');
http
  .createServer((req, res) => {
    console.log(bean['mapping']);
    const handler = bean.getHandler(req);
    const returnValue = handler.handle(req, res);
    console.log(returnValue);
    return res.end('');
  })
  .listen(9222);
const req = http.request(
  'http://localhost:9222/user/zcs/get?time=1600855064822&level=001',
  {
    method: 'POST',
    headers: {
      cookie: 'jsessionid=1987;token=9494',
      'content-type': 'application/json',
      accept: '*/*',
    },
  },
);
req.write(JSON.stringify({ userId: 'a12fe', userName: 'runner_zcs' }));
req.end();
