import path from 'path';
import LocateParser from './locate_parser';

it('getLocate', () => {
  const parser = new LocateParser([
    'definition/bean_definition.ts',
    './locateparser/locate_parser.ts',
    '../better-inject/package.json',
    'package.json',
    './package-lock.json',
  ]);
  expect(parser.getLocates()).toEqual([
    path.join(process.cwd(), 'definition/bean_definition.ts'),
    path.join(process.cwd(), 'locateparser/locate_parser.ts'),
    path.join(process.cwd(), 'package.json'),
    path.join(process.cwd(), 'package.json'),
    path.join(process.cwd(), 'package-lock.json'),
  ]);
});

it('getLocate with ** and *', () => {
  const parser = new LocateParser([
    'test/**/*.js',
    'test/**/target.ts',
    'test/c/*',
  ]);
  expect(parser.getLocates()).toEqual([
    path.join(process.cwd(), 'test/a/a.js'),
    path.join(process.cwd(), 'test/b/b.js'),
    path.join(process.cwd(), 'test/a/target.ts'),
    path.join(process.cwd(), 'test/c/cc'),
    path.join(process.cwd(), 'test/c/ccc'),
  ]);
});
