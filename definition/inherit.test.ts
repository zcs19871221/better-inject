import Definition from '.';

class Tmp {}
it('index param', () => {
  const animal = new Definition({
    id: 'animal',
    beanClass: Tmp,
    constructParams: {
      0: {
        value: '18',
      },
    },
  });
  const people = new Definition({
    id: 'people',
    beanClass: Tmp,
    parent: 'animal',
    constructParams: {
      1: {
        value: '张成思',
      },
    },
  });
  const man = new Definition({
    id: 'man',
    beanClass: Tmp,
    parent: 'people',
    constructParams: {
      2: {
        value: '男',
      },
    },
  });
  const map: Map<string, Definition> = new Map();
  map.set('man', man);
  map.set('animal', animal);
  map.set('people', people);
  expect(man.getMergedParmas(map)).toEqual({
    0: {
      value: '18',
    },
    1: {
      value: '张成思',
    },
    2: {
      value: '男',
    },
  });
});
it('merge param', () => {
  const animal = new Definition({
    id: 'animal',
    beanClass: Tmp,
    constructParams: {
      0: [
        {
          name: {
            value: '张成思',
          },
        },
      ],
    },
  });
  const people = new Definition({
    id: 'people',
    beanClass: Tmp,
    parent: 'animal',
    constructParams: {
      0: [
        {
          gender: {
            value: '男',
          },
          age: {
            value: 18,
          },
        },
      ],
    },
  });
  const man = new Definition({
    id: 'man',
    beanClass: Tmp,
    parent: 'people',
    constructParams: {
      0: [
        {
          walth: { value: '11111' },
        },
      ],
    },
  });
  const map: Map<string, Definition> = new Map();
  map.set('man', man);
  map.set('animal', animal);
  map.set('people', people);
  expect(man.getMergedParmas(map)).toEqual({
    0: [
      {
        gender: {
          value: '男',
        },
        age: {
          value: 18,
        },
        name: {
          value: '张成思',
        },
        walth: {
          value: '11111',
        },
      },
    ],
  });
});
