import helper from '../annotation/meta_helper';
import { Resource } from '../../annotation/inject';
import { filterAndCheckMapping } from '../request_mapping';

const Controller = (ctr: any) => {
  const mvcMeta = helper.get(ctr);
  if (mvcMeta === undefined) {
    throw new Error('controller必须用requestmapping注解');
  }
  filterAndCheckMapping(mvcMeta);
  helper.set(ctr, mvcMeta);
  Resource({ type: 'single', isController: true })(ctr);
};

export default Controller;
