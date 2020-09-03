import MappingInfo from './request_mapping_info';

it('getMathcing', () => {
  const d = new MappingInfo({
    type: 'init',
    path: '*',
    method: ['GET'],
    accept: ['*/*', 'text/*'],
    contentType: ['text/*', 'application/json'],
    headers: 'myHeader=value;!cookie',
    params: 'user=zcs;!password',
  });
  const matched = <any>d.getMatchingCondition(<any>{
    url: '/',
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
  expect(matched['pathCondition'].hashCode()).toBe('path:*');
  expect(matched['methodCondition'].hashCode()).toBe('method:GET');
  expect(matched['acceptCondition'].hashCode()).toBe('accept:text/*||*/*');
  expect(matched['contentTypeCondition'].hashCode()).toBe('contentType:text/*');
  expect(matched['headerCondition'].hashCode()).toBe(
    'header:myHeader=value&&!cookie',
  );
  expect(matched['paramCondition'].hashCode()).toBe(
    'param:user=zcs&&!password',
  );
});
