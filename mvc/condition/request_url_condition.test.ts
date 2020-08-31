import Condition from './request_url_condition';
import { IncomingMessage } from 'http';

it('getMatchingCondition', () => {
  const d = new Condition(['/abcdef']);
  const req: any = { url: '/sffdsfsd' };
  expect(
    d
      .getMatchingCondition(req)
      .getContent()
      .map(each => each.getContent()),
  ).toEqual();
});

it('compareTo', () => {
  const d = new Condition();
});

it('combine', () => {
  const d = new Condition();
});

it('hashCode', () => {
  const d = new Condition();
});

it('filterPureUrl', () => {
  const d = new Condition();
});
