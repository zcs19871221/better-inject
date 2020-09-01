import Condition from './request_method_condition';

it('getMatchingCondition', () => {
  const d = new Condition(['GET']);
  const req: any = { method: 'GET' };
  const matched = <Condition>d.getMatchingCondition(req);
  expect(matched.getContent().map(pattern => pattern.getContent())).toEqual([
    '/bcdefg',
    '/{name}',
    '/bcd*fg',
  ]);
});

it('sort', () => {
  const a = new Condition([]);
  const b = new Condition(['/abc/**/a*.html', '/abcdef']);
  const c = new Condition(['/abc', '/{abc}/a.html']);
  const d = new Condition(['/abcde', '*', '/{a}/**/a.html']);
  const e = new Condition(['/abcde']);
  const list = [a, b, c, d, e];
  list.sort((a, b) => a.compareTo(b));
  expect(list).toEqual([b, d, e, c, a]);
});

it('combine', () => {
  const a = new Condition([]);
  const b = new Condition(['/id1', 'id2']);
  const c = new Condition(['/other/**', 'u', '/list']);
  const d = new Condition(['/id1', '/id2']);
  expect(a.combine(b)).toBe(b);
  expect(b.combine(a)).toBe(b);
  expect(
    c
      .combine(d)
      .getContent()
      .map(each => each.getContent()),
  ).toEqual([
    '/list/id1',
    '/list/id2',
    'u/id1',
    'u/id2',
    '/other/**/id1',
    '/other/**/id2',
  ]);
});

it('hashCode', () => {
  const a = new Condition(['/other/**', 'u', '/list']);
  const b = new Condition([]);
  expect(a.hashCode()).toBe('path:/list||u||/other/**');
  expect(b.hashCode()).toBe('');
});
