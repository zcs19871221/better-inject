import Condition from './request_path_condition';

it('getMatchingCondition with empty', () => {
  const d = new Condition([]);
  const req: any = { url: '/abcdefghg' };
  const matched = d.getMatchingCondition(req);
  expect(matched).toBe(d);
});
it('getMatchingCondition when not hit', () => {
  const d = new Condition(['/abcdefg']);
  const req: any = { url: '/bcdefg' };
  const matched = d.getMatchingCondition(req);
  expect(matched).toBe(null);
});
it('getMatchingCondition with filtered and sort', () => {
  const d = new Condition(['/abcdefg', '/bcdefg', '/bcd*fg', '/{name}']);
  const req: any = { url: '/bcdefg' };
  const matched = <Condition>d.getMatchingCondition(req);
  expect(matched.getContent().map(pattern => pattern.getContent())).toEqual([
    '/bcdefg',
    '/{name}',
    '/bcd*fg',
  ]);
});
it('getMatchingCondition with path variable name', () => {
  const d = new Condition(['/{base}', '/a/text', '/a/{sub}']);
  const req: any = { url: '/text' };
  const matched = <Condition>d.getMatchingCondition(req);
  expect(matched.getContent().map(pattern => pattern.getContent())).toEqual([
    '/text',
    '/a/{sub}',
    '/{name}',
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
