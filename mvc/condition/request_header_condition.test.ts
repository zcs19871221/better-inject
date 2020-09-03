import Condition from './request_header_condition';

it('getMatching', () => {
  const condition = new Condition('myHeader=abcde;accept-language;!cookie');
  expect(
    condition.getMatchingCondition(<any>{
      headers: {
        myHeader: 'abcde',
        'accept-language': 'fuck',
      },
    }),
  ).toBe(condition);
  expect(
    condition.getMatchingCondition(<any>{
      headers: {
        myHeader: 'abcdef',
        'accept-language': 'fuck',
      },
    }),
  ).toBe(null);
  expect(
    condition.getMatchingCondition(<any>{
      headers: {
        myHeader: 'abcde',
      },
    }),
  ).toBe(null);
  expect(
    condition.getMatchingCondition(<any>{
      headers: {
        myHeader: 'abcde',
        'accept-language': 'fuck',
        cookie: 'sdfsdfd',
      },
    }),
  ).toBe(null);
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

  expect(a.hashCode()).toBe('header:myHeader=abcde&&accept-language&&!cookie');
});
