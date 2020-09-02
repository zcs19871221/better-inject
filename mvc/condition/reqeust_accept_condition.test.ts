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

// it('sort', () => {
//   const a = new Condition(['GET']);
//   const b = new Condition(['GET', 'POST']);
//   const c = new Condition(['GET', 'POST', 'CONNECT']);

//   const list = [a, b, c];
//   list.sort((a, b) => a.compareTo(b));
//   expect(list).toEqual([c, b, a]);
// });

// it('combine', () => {
//   const a = new Condition(['GET']);
//   const b = new Condition(['GET', 'POST']);
//   expect(
//     a
//       .combine(b)
//       .getContent()
//       .join(','),
//   ).toBe('GET,POST');
// });

// it('hashCode', () => {
//   const a = new Condition(['GET', 'POST', 'PUT']);
//   expect(a.hashCode()).toBe('method:GET||POST||PUT');
// });
