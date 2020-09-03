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
