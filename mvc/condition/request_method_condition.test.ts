import Condition from './request_method_condition';

it('getMatchingCondition', () => {
  const d = new Condition(['GET', 'POST', 'CONNECT']);
  const req: any = { method: 'GET' };
  const matched = <Condition>d.getMatchingCondition(req);
  expect(matched.getContent().join(',')).toEqual('GET');
});

it('sort', () => {
  const a = new Condition(['GET']);
  const b = new Condition(['GET', 'POST']);
  const c = new Condition(['GET', 'POST', 'CONNECT']);

  const list = [a, b, c];
  list.sort((a, b) => a.compareTo(b));
  expect(list).toEqual([c, b, a]);
});

it('combine', () => {
  const a = new Condition(['GET']);
  const b = new Condition(['GET', 'POST']);
  expect(
    a
      .combine(b)
      .getContent()
      .join(','),
  ).toBe('GET,POST');
});

it('hashCode', () => {
  const a = new Condition(['GET', 'POST', 'PUT']);
  expect(a.hashCode()).toBe('method:GET||POST||PUT');
});
