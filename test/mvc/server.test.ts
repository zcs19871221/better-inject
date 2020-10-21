import Server from '../../mvc/server';
import Request from 'better-request';
import Context from '../..';

const context = new Context({
  scanFiles: 'test/mvc/**/*.ts',
});

const port = 8555;
const host = 'localhost:' + port;
const serverPath = `http://${host}`;
const testServer: Server = new Server(context, { port });
testServer.start();
// beforeAll(() => {
//   testServer.start();
// });
// afterAll(() => {
//   testServer.stop();
// });

// it('', async () => {
const request = new Request({
  url: `${serverPath}/user/index.html`,
  method: 'GET',
  search: {
    name: 'zcs',
    gender: '男',
  },
});
request.fetch(null).then(res => {
  console.log(res);
});
// expect(res).toBe('');
// });
