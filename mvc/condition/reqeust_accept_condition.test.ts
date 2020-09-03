import Condition from './reqeust_accept_condition';

it('getMatchingCondition', () => {
  expect(
    (<Condition>(
      new Condition([
        '*/*',
        'text/*',
        'text/html',
        'application/xml',
        'application/*',
      ]).getMatchingCondition(<any>{ headers: { accept: 'text/html' } })
    ))
      .getContent()
      .map(e => e.getContent()),
  ).toEqual(['text/html', 'text/*', '*/*']);
  expect(
    (<Condition>(
      new Condition([
        '*/*',
        'text/*',
        'text/xhtml',
        'text/html',
        'application/xml',
        'application/*',
      ]).getMatchingCondition(<any>{ headers: { accept: 'text/html+xhtml' } })
    ))
      .getContent()
      .map(e => e.getContent()),
  ).toEqual(['text/xhtml', 'text/html', 'text/*', '*/*']);
  expect(
    (<Condition>(
      new Condition([
        '*/*',
        'text/*',
        'text/html',
        'application/xml',
        'application/*',
      ]).getMatchingCondition(<any>{ headers: { accept: '*/*' } })
    ))
      .getContent()
      .map(e => e.getContent()),
  ).toEqual(['text/html', 'application/xml', 'text/*', 'application/*', '*/*']);
  expect(
    (<Condition>new Condition([
      'text/html',
      'image/*',
      'image/png',
      'text/plain',
      'image/jpeg',
      'application/javascript',
    ]).getMatchingCondition(<any>{
      headers: { accept: 'text/*,image/*' },
    }))
      .getContent()
      .map(e => e.getContent()),
  ).toEqual(['text/html', 'image/png', 'text/plain', 'image/jpeg', 'image/*']);
});

it('sort', () => {
  const a = new Condition(['text/html', '*/*']);
  const b = new Condition(['text/*', 'text/plain']);
  const e = new Condition(['text/*', 'image/a', 'image/b']);
  const c = new Condition(['application/*']);
  const d = new Condition(['application/text']);

  expect(
    [b, a].sort((a, b) =>
      a.compareTo(b, <any>{
        headers: { accept: '*/*;q=0.8,text/html' },
      }),
    ),
  ).toEqual([a, b]);
  expect(
    [b, a].sort((a, b) =>
      a.compareTo(b, <any>{
        headers: { accept: '*/*;q=0.8,text/html;q=0.7,text/plain' },
      }),
    ),
  ).toEqual([b, a]);
  expect(
    [b, c, d].sort((a, b) =>
      a.compareTo(b, <any>{
        headers: { accept: '*/*;q=0.8,text/html' },
      }),
    ),
  ).toEqual([b, c, d]);
  expect(
    [e, b, a].sort((a, b) =>
      a.compareTo(b, <any>{
        headers: { accept: '*/*;q=0.8,text/html' },
      }),
    ),
  ).toEqual([a, b, e]);
});

it('combine', () => {
  const a = new Condition(['text/html', '*/*']);
  const b = new Condition(['text/*', 'text/plain']);
  const c = new Condition([]);
  expect(a.combine(b)).toBe(b);
  expect(a.combine(c)).toBe(a);
});

it('hashCode', () => {
  const a = new Condition(['text/*', 'text/plain', '*/*']);
  expect(a.hashCode()).toBe('accept:text/plain||text/*||*/*');
});
