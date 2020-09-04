import MappingInfo from './request_mapping_info';

it('getMathcing', () => {
  let d = new MappingInfo({
    type: 'init',
    path: ['/abffdef', '/abcdef'],
    method: ['GET'],
    accept: ['*/*', 'text/*'],
    contentType: ['text/*', 'application/json'],
    headers: 'myHeader=value;!cookie',
    params: 'user=zcs;!password',
  });
  let matched = <any>d.getMatchingCondition(<any>{
    url: '/abcdef',
    method: 'GET',
    headers: {
      accept: '',
      'content-type': 'text/html',
      myHeader: 'value',
    },
    params: {
      user: 'zcs',
    },
  });
  expect(matched['pathCondition'].hashCode()).toBe('path:/abcdef');
  expect(matched['methodCondition'].hashCode()).toBe('method:GET');
  expect(matched['acceptCondition'].hashCode()).toBe('accept:text/*||*/*');
  expect(matched['contentTypeCondition'].hashCode()).toBe('contentType:text/*');
  expect(matched['headerCondition'].hashCode()).toBe(
    'headers:myHeader=value&&!cookie',
  );
  expect(matched['paramCondition'].hashCode()).toBe(
    'params:user=zcs&&!password',
  );

  d = new MappingInfo({
    type: 'init',
    path: ['/*'],
  });
  matched = <any>d.getMatchingCondition(<any>{
    url: '/abcdef',
    method: 'GET',
    headers: {
      accept: '',
      'content-type': 'text/html',
      myHeader: 'value',
    },
    params: {
      user: 'zcs',
    },
  });
  expect(matched['pathCondition'].hashCode()).toBe('path:/*');
  expect(matched['methodCondition'].hashCode()).toBe('');
  expect(matched['acceptCondition'].hashCode()).toBe('');
  expect(matched['contentTypeCondition'].hashCode()).toBe('');
  expect(matched['headerCondition'].hashCode()).toBe('');
  expect(matched['paramCondition'].hashCode()).toBe('');

  d = new MappingInfo({
    type: 'init',
    path: ['/abc{char}f'],
    accept: '',
  });
  matched = <any>d.getMatchingCondition(<any>{
    url: '/abcdef',
    method: 'GET',
    headers: {
      accept: 'text/html',
      'content-type': 'text/html',
      myHeader: 'value',
    },
    params: {
      user: 'zcs',
    },
  });
  expect(matched['pathCondition'].hashCode()).toBe('path:/abc{char}f');
  expect(matched['methodCondition'].hashCode()).toBe('');
  expect(matched['acceptCondition'].hashCode()).toBe('');
  expect(matched['contentTypeCondition'].hashCode()).toBe('');
  expect(matched['headerCondition'].hashCode()).toBe('');
  expect(matched['paramCondition'].hashCode()).toBe('');

  d = new MappingInfo({
    type: 'init',
    path: ['/abc{char}f'],
    accept: 'text/plain',
  });
  matched = <any>d.getMatchingCondition(<any>{
    url: '/abcdef',
    method: 'GET',
    headers: {
      accept: 'text/html',
      'content-type': 'text/html',
      myHeader: 'value',
    },
    params: {
      user: 'zcs',
    },
  });
  expect(matched).toBe(null);
});

it('sort', () => {
  let a = new MappingInfo({
    type: 'init',
    path: ['/abffdef', '/abcdef', '/abcd*'],
  });
  let b = new MappingInfo({
    type: 'init',
    path: ['/abffdef', '/abcdef'],
    method: ['GET', 'POST'],
  });
  let c = new MappingInfo({
    type: 'init',
    path: ['/abffdef', '/abcdef'],
    method: ['POST'],
  });
  let d = new MappingInfo({
    type: 'init',
    path: ['/abffdef', '/abcdef'],
    params: 'name=zcs',
    method: ['POST'],
  });
  let e = new MappingInfo({
    type: 'init',
    path: ['/abffdef', '/abcdef'],
    params: 'name=zcs;user=123',
    method: ['POST'],
  });
  let f = new MappingInfo({
    type: 'init',
    path: ['/abffdef', '/abcdef'],
    method: ['POST'],
    params: 'name=zcs;user=123',
    headers: 'myHeader1;myHeader2',
  });
  let g = new MappingInfo({
    type: 'init',
    path: ['/abffdef', '/abcdef'],
    method: ['POST'],
    params: 'name=zcs;user=123',
    headers: 'myHeader1=1234;myHeader2',
  });
  let h = new MappingInfo({
    type: 'init',
    path: ['/abffdef', '/abcdef'],
    method: ['POST'],
    params: 'name=zcs;user=123',
    headers: 'myHeader1=1234;myHeader2',
    contentType: ['text/*', '*/*'],
  });
  let i = new MappingInfo({
    type: 'init',
    path: ['/abffdef', '/abcdef'],
    method: ['POST'],
    params: 'name=zcs;user=123',
    headers: 'myHeader1=1234;myHeader2',
    contentType: ['text/html', 'text/*'],
  });
  let j = new MappingInfo({
    type: 'init',
    path: ['/abffdef', '/abcdef'],
    method: ['POST'],
    params: 'name=zcs;user=123',
    headers: 'myHeader1=1234;myHeader2',
    contentType: ['text/html', 'text/*'],
    accept: ['text/*', 'application/javascript', '*/*'],
  });
  let k = new MappingInfo({
    type: 'init',
    path: ['/abffdef', '/abcdef'],
    method: ['POST'],
    params: 'name=zcs;user=123',
    headers: 'myHeader1=1234;myHeader2',
    contentType: ['text/html', 'text/*'],
    accept: ['*/*'],
  });
  expect(
    [e, b, c, d, g, a, f, k, i, h, j].sort((a, b) =>
      a.compareTo(b, <any>{
        headers: {
          accept: 'text/html',
        },
      }),
    ),
  ).toEqual([a, b, k, j, i, h, g, f, e, d, c]);
});

it('combine', () => {
  let a = new MappingInfo({
    type: 'init',
    path: ['/base', '*'],
  });
  let b = new MappingInfo({
    type: 'init',
    path: ['/abffdef', '/abcdef'],
    method: ['GET', 'POST'],
  });
  let tmp = a.combine(b);
  expect(tmp.hashCode()).toBe(
    'path:/base/abffdef||/base/abcdef||/abffdef||/abcdef && method:GET||POST',
  );
  let c = new MappingInfo({
    type: 'init',
    method: ['POST'],
  });
  let tmp1 = tmp.combine(c);
  expect(tmp1.hashCode()).toBe(
    'path:/base/abffdef||/base/abcdef||/abffdef||/abcdef && method:GET||POST',
  );
  let d = new MappingInfo({
    type: 'init',
    params: 'name=zcs;pwd=123',
    method: ['POST'],
  });
  let tmp2 = tmp1.combine(d);
  expect(tmp2.hashCode()).toBe(
    'path:/base/abffdef||/base/abcdef||/abffdef||/abcdef && method:GET||POST && params:name=zcs&&pwd=123',
  );
  let e = new MappingInfo({
    type: 'init',
    params: 'name=zcs;user=123',
    method: ['POST'],
  });
  let tmp3 = tmp2.combine(e);
  expect(tmp3.hashCode()).toBe(
    'path:/base/abffdef||/base/abcdef||/abffdef||/abcdef && method:GET||POST && params:name=zcs&&pwd=123&&user=123',
  );
  let f = new MappingInfo({
    type: 'init',
    method: ['POST'],
    headers: 'myHeader1;myHeader2',
  });
  let tmp4 = tmp3.combine(f);
  expect(tmp4.hashCode()).toBe(
    'path:/base/abffdef||/base/abcdef||/abffdef||/abcdef && method:GET||POST && params:name=zcs&&pwd=123&&user=123 && headers:myHeader1&&myHeader2',
  );
  let g = new MappingInfo({
    type: 'init',
    method: ['POST'],
  });
  let tmp5 = tmp4.combine(g);
  expect(tmp5.hashCode()).toBe(
    'path:/base/abffdef||/base/abcdef||/abffdef||/abcdef && method:GET||POST && params:name=zcs&&pwd=123&&user=123 && headers:myHeader1&&myHeader2',
  );
  let h = new MappingInfo({
    type: 'init',
    method: ['POST'],
    contentType: ['text/*', '*/*'],
  });
  let tmp6 = tmp5.combine(h);
  expect(tmp6.hashCode()).toBe(
    'path:/base/abffdef||/base/abcdef||/abffdef||/abcdef && method:GET||POST && params:name=zcs&&pwd=123&&user=123 && headers:myHeader1&&myHeader2 && contentType:text/*||*/*',
  );
});
