import Context from '.';

it('context with inherit', () => {
  const context = new Context({
    configFiles: 'test/inerit/config.ts',
  });
  expect(<any>(<any>context.getBean('sub1')).getAll()).toBe('张三男burger');
  expect(<any>(<any>context.getBean('sub2')).getAll()).toBe('张三男coke cola');
  expect(
    <any>(<any>context.getBean('sub1', {
      name: '李四',
      gender: undefined,
      food: 'piza',
    })).getAll(),
  ).toBe('李四男piza');
});
