import Condition from '../mvc/condition/reqeust_accept_condition';

console.log(
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
);

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
