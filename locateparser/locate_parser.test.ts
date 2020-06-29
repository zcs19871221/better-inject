import path from 'path';
import LocateParser from './locate_parser';

it('getLocate', () => {
  const current = __dirname;
  const parser = new LocateParser([
    '../definition/bean_definition.ts',
    current,
    'locate_parser.ts',
    './locate_parser.ts',
  ]);
  expect(parser.getLocates()).toEqual([
    path.join(__dirname, '../definition/bean_definition.ts'),
    current,
    path.join(__dirname, 'locate_parser.ts'),
    path.join(__dirname, 'locate_parser.ts'),
  ]);
});
