import Target from './url_pattern';

it('getMatchingCondition empty', () => {
  const url = '/';
  const obj = new Target('');
  expect(obj.getMatchingCondition(url)).toBe(true);
});
it('getMatchingCondition common', () => {
  const url = '/abcd/efgh/ijk';
  const obj = new Target('/abcd/efgh/ijk');
  expect(obj.getMatchingCondition(url)).toBe(true);
});
it('getMatchingCondition common', () => {
  const url = '/abcd/efgh/ijk';
  const obj = new Target('/abcd/efgh/ijk');
  expect(obj.getMatchingCondition(url)).toBe(true);
});
