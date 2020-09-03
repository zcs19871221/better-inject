import Condition from './reqeust_content_type_condition';

it('getMatchingCondition', () => {
  expect(
    (<Condition>new Condition([
      '*/*',
      'text/*',
      'text/html',
      'application/xml',
      'application/*',
    ]).getMatchingCondition(<any>{
      headers: {
        'content-type':
          'multipart/form-data; boundary=----WebKitFormBoundaryErYE0celysXRvxY7; charset=utf-8',
      },
    }))
      .getContent()
      .map(e => e.getContent()),
  ).toEqual(['*/*']);
  expect(
    (<Condition>new Condition([
      '*/*',
      'text/*',
      'text/html',
      'application/xml',
      'application/*',
    ]).getMatchingCondition(<any>{
      headers: {
        'content-type': 'text/html',
      },
    }))
      .getContent()
      .map(e => e.getContent()),
  ).toEqual(['text/html', 'text/*', '*/*']);
});

it('sort', () => {
  const a = new Condition([]);
  const b = new Condition(['text/html', 'text/*', '*/*']);
  const d = new Condition(['text/*', '*/*']);
  const c = new Condition([]);
  expect([a, c].sort((a, b) => a.compareTo(b, <any>{}))).toEqual([a, c]);
  expect([a, b].sort((a, b) => a.compareTo(b, <any>{}))).toEqual([b, a]);
  expect([d, b].sort((a, b) => a.compareTo(b, <any>{}))).toEqual([b, d]);
});

it('combine', () => {
  const b = new Condition(['text/html', 'text/*', '*/*']);
  const d = new Condition(['text/*', '*/*']);
  expect(b.combine(d)).toBe(d);
});

it('hashCode', () => {
  const b = new Condition(['text/html', 'text/*', '*/*']);
  expect(b.hashCode()).toBe('contentType:text/html||text/*||*/*');
});
