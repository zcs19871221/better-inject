import Dao from './dao';
import Service from './service';
export default {
  dao: {
    alias: ['Dao'],
    class: Dao,
    injectProperties: ['jdbc://oracle'],
    type: 'prototype',
  },
  service: {
    alias: ['services', 'services1'],
    class: Service,
    injectProperties: [Dao],
    type: 'single',
  },
};
