import path from 'path';
import LocateParser from '.';

it('getLocate', () => {
  const parser = new LocateParser([
    'definition/index.ts',
    './locateparser/index.ts',
    '../better-inject/package.json',
    'package.json',
    './package-lock.json',
  ]);
  expect(parser.getLocates()).toEqual([
    path.join(process.cwd(), 'definition/index.ts'),
    path.join(process.cwd(), 'locateparser/index.ts'),
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

it('only *', () => {
  const parser = new LocateParser('*.ts');
  expect(parser.getLocates().sort()).toEqual(
    [
      path.join(process.cwd(), 'index.ts'),
      path.join(process.cwd(), 'index.d.ts'),
    ].sort(),
  );
});

it('require json', () => {
  const parser = new LocateParser('package.json');
  expect(parser.require()[0].name).toEqual('better-inject');
});
