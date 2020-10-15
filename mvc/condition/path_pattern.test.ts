import Condition from './path_pattern';

it('matching', () => {
  const pattern_url_result: [boolean, string, string][] = [
    // test exact matching
    [true, 'test', 'test'],
    [true, '/test', '/test'],
    [true, 'http://example.org', 'http://example.org'], // SPR-14141
    [false, '/test.jpg', 'test.jpg'],
    [false, 'test', '/test'],
    [false, '/test', 'test'],
    // test matching with ?'s
    [true, 't?st', 'test'],
    [true, '??st', 'test'],
    [true, 'tes?', 'test'],
    [true, 'te??', 'test'],
    [true, '?es?', 'test'],
    [false, 'tes?', 'tes'],
    [false, 'tes?', 'testt'],
    [false, 'tes?', 'tsst'],
    // test matching with *'s
    [true, '*', 'test'],
    [true, 'test*', 'test'],
    [true, 'test*', 'testTest'],
    [true, 'test/*', 'test/Test'],
    [true, 'test/*', 'test/t'],
    [true, 'test/*', 'test/'],
    [true, '*test*', 'AnothertestTest'],
    [true, '*test', 'Anothertest'],
    [true, '*.*', 'test.'],
    [true, '*.*', 'test.test'],
    [true, '*.*', 'test.test.test'],
    [true, 'test*aaa', 'testblaaaa'],
    [false, 'test*', 'tst'],
    [false, 'test*', 'tsttest'],
    [false, 'test*', 'test/'],
    [false, 'test*', 'test/t'],
    [false, 'test/*', 'test'],
    [false, '*test*', 'tsttst'],
    [false, '*test', 'tsttst'],
    [false, '*.*', 'tsttst'],
    [false, 'test*aaa', 'test'],
    [false, 'test*aaa', 'testblaaab'],

    // test matching with ?'s and /'s
    [true, '/?', '/a'],
    [true, '/?/a', '/a/a'],
    [true, '/a/?', '/a/b'],
    [true, '/??/a', '/aa/a'],
    [true, '/a/??', '/a/bb'],
    [true, '/?', '/a'],

    // test matching with **'s
    [true, '/**', '/testing/testing'],
    [true, '/*/**', '/testing/testing'],
    [true, '/**/*', '/testing/testing'],
    [true, '/bla/**/bla', '/bla/testing/testing/bla'],
    [true, '/bla/**/bla', '/bla/testing/testing/bla/bla'],
    [true, '/**/test', '/bla/bla/test'],
    [true, '/bla/**/**/bla', '/bla/bla/bla/bla/bla/bla'],
    [true, '/bla*bla/test', '/blaXXXbla/test'],
    [true, '/*bla/test', '/XXXbla/test'],
    [false, '/bla*bla/test', '/blaXXXbl/test'],
    [false, '/*bla/test', 'XXXblab/test'],
    [false, '/*bla/test', 'XXXbl/test'],

    [false, '/????', '/bala/bla'],
    [false, '/**/*bla', '/bla/bla/bla/bbb'],

    [
      true,
      '/*bla*/**/bla/**',
      '/XXXblaXXXX/testing/testing/bla/testing/testing/',
    ],
    [true, '/*bla*/**/bla/*', '/XXXblaXXXX/testing/testing/bla/testing'],
    [
      true,
      '/*bla*/**/bla/**',
      '/XXXblaXXXX/testing/testing/bla/testing/testing',
    ],
    [
      true,
      '/*bla*/**/bla/**',
      '/XXXblaXXXX/testing/testing/bla/testing/testing.jpg',
    ],

    [
      true,
      '*bla*/**/bla/**',
      'XXXblaXXXX/testing/testing/bla/testing/testing/',
    ],
    [true, '*bla*/**/bla/*', 'XXXblaXXXX/testing/testing/bla/testing'],
    [true, '*bla*/**/bla/**', 'XXXblaXXXX/testing/testing/bla/testing/testing'],
    [false, '*bla*/**/bla/*', 'XXXblaXXXX/testing/testing/bla/testing/testing'],

    [false, '/x/x/**/bla', '/x/x/x/'],

    [true, '/foo/bar/**', '/foo/bar'],

    [true, '', ''],
  ];
  pattern_url_result.forEach(([result, pattern, url]) => {
    const obj = new Condition(pattern);
    const matched = obj.getMatchingCondition(url);
    expect(matched).toBe(result === true ? obj : null);
  });
});

it('varaible', () => {
  const obj = new Condition('/{base}/do{work}harder.*');
  const matched = <Condition>(
    obj.getMatchingCondition('/it/doProgramharder.html')
  );
  const varaible = matched.getVariableMap();
  expect(varaible.get('base')).toBe('it');
  expect(varaible.get('work')).toBe('Program');
});

it('varaible ** and last ', () => {
  const obj = new Condition('/it/**/{key}.*');
  const matched = <Condition>(
    obj.getMatchingCondition('/it/doProgramharder/x/y/docid.html')
  );
  const varaible = matched.getVariableMap();
  expect(varaible.get('key')).toBe('docid');
});

it('combine normal', () => {
  let class1 = new Condition('/abcd');
  let method1 = new Condition('efgh');
  let merged: Condition = class1.combine(method1);
  expect(merged.getContent()).toBe('/abcd/efgh');
  expect(merged.getMatchingCondition('/abcd/efgh')).toBe(merged);
});

it('combine wildcard variable', () => {
  let class1 = new Condition('/{base}/**/fuck');
  let method1 = new Condition('/a*do{name}.html');
  let merged: Condition = class1.combine(method1);
  expect(merged.getContent()).toBe('/{base}/**/fuck/a*do{name}.html');
  const matched = <Condition>(
    merged.getMatchingCondition('/MONETY/a/df/df/fuck/abitchdoWORK.html')
  );
  expect(matched.getVariableMap().get('base')).toBe('MONETY');
  expect(matched.getVariableMap().get('name')).toBe('WORK');
});

it('combine with specail end', () => {
  let class1 = new Condition('/*');
  let method1 = new Condition('/hotel');
  let merged: Condition = class1.combine(method1);
  expect(merged.getContent()).toBe('/hotel');
  class1 = new Condition('/*.*');
  method1 = new Condition('/*.hotel');
  merged = class1.combine(method1);
  expect(merged.getContent()).toBe('/*.hotel');
  class1 = new Condition('/{foo}');
  method1 = new Condition('/bar');
  merged = class1.combine(method1);
  expect(merged.getContent()).toBe('/{foo}/bar');
  class1 = new Condition('/{foo}');
  method1 = new Condition('/bar');
  merged = class1.combine(method1);
  expect(merged.getContent()).toBe('/{foo}/bar');
  class1 = new Condition('/*.html');
  method1 = new Condition('/hotel');
  merged = class1.combine(method1);
  expect(merged.getContent()).toBe('/hotel.html');
  class1 = new Condition('/*.html');
  method1 = new Condition('/hotel.*');
  merged = class1.combine(method1);
  expect(merged.getContent()).toBe('/hotel.html');
});

it('sort', () => {
  const s1 = new Condition('/{base}/do{work}harder.*');
  const s2 = new Condition('/abcd');
  const s3 = new Condition('/abcdef');
  const s4 = new Condition('/abcdefg/*');
  const s5 = new Condition('/abcdef/*');
  const s6 = new Condition('/accd/**/*/a');
  const s7 = new Condition('/accd/**/a');
  const s8 = new Condition('/accd/*/a');
  const s9 = new Condition('/accd/{d}/a');
  const list = [s1, s2, s3, s4, s5, s6, s7, s8, s9];
  list.sort((a, b) => a.compareTo(b));
  expect(list.map(each => each.getContent())).toEqual([
    '/abcdef',
    '/abcd',
    '/accd/{d}/a',
    '/accd/*/a',
    '/accd/**/a',
    '/accd/**/*/a',
    '/{base}/do{work}harder.*',
    '/abcdefg/*',
    '/abcdef/*',
  ]);
});
