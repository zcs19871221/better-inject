import Condition from './request_param_condition';

it('getMatching', () => {
  expect(() => new Condition('myHeader=abcde;!myHeader')).toThrow();
  expect(() => new Condition('myHeader=abcde;myHeader')).toThrow();
  expect(() => new Condition('myHeader=abcde;myHeader=2234')).toThrow();
  const condition = new Condition('myHeader=abcde;accept-language;!cookie');
  expect(
    condition.getMatchingCondition(<any>{
      params: {
        myHeader: 'abcde',
        'accept-language': 'fuck',
      },
    }),
  ).toBe(condition);
  expect(
    condition.getMatchingCondition(<any>{
      params: {
        myHeader: 'abcdef',
        'accept-language': 'fuck',
      },
    }),
  ).toBe(null);
  expect(
    condition.getMatchingCondition(<any>{
      params: {
        myHeader: 'abcde',
      },
    }),
  ).toBe(null);
  expect(
    condition.getMatchingCondition(<any>{
      params: {
        myHeader: 'abcde',
        'accept-language': 'fuck',
        cookie: 'sdfsdfd',
      },
    }),
  ).toBe(null);
  const condition2 = new Condition('!user=1234');
  expect(
    condition2.getMatchingCondition(<any>{
      params: {
        user: '1234',
      },
    }),
  ).toBe(null);
  expect(
    condition2.getMatchingCondition(<any>{
      params: {},
    }),
  ).toBe(condition2);
  expect(
    condition2.getMatchingCondition(<any>{
      params: {
        user: '2345',
      },
    }),
  ).toBe(condition2);
});

it('sort', () => {
  const a = new Condition('myHeader=abcde;accept-language;!cookie');
  const b = new Condition('myHeader=abcde;accept-language;!cookie;myHeader2');
  const d = new Condition('myHeader=abcde;accept-language;!cookie;myHeader2=1');
  const c = new Condition('myHeader=abcde;accept-language=value;!cookie');

  expect([a, b, c, d].sort((a, b) => a.compareTo(b))).toEqual([d, b, c, a]);
});

it('combine', () => {
  const a = new Condition('myHeader=abcde;accept-language;!cookie');
  const b = new Condition('myHeader=abcde;accept-language;!cookie;myHeader2');

  expect(
    a
      .combine(b)
      .getContent()
      .map(each => each),
  ).toEqual(['myHeader=abcde', 'accept-language', '!cookie', 'myHeader2']);
});
it('hashCode', () => {
  const a = new Condition('myHeader=abcde;accept-language;!cookie');

  expect(a.hashCode()).toBe('params:myHeader=abcde&&accept-language&&!cookie');
});
