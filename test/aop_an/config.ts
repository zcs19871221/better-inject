import { Checker } from '../..';

export default Checker([
  {
    id: 'testaspect2',
    type: 'aspect',
    pointCuts: [
      {
        id: 'p0',
        classMatcher: 'c1',
        methodMatcher: 'getName',
      },
    ],
    adviceConfigs: [
      [
        'before',
        'logArgs',
        {
          classMatcher: 'c1',
          methodMatcher: 'getName',
        },
      ],
      ['around', 'around', 'p0'],
      ['after', 'after', 'p0'],
      ['afterReturn', 'afterReturn', 'globalPointCutC1'],
      ['afterThrow', 'afterReturn', 'globalPointCutC1'],
    ],
  },
]);
