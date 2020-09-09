import helper from './helper';
import { Resource } from '../../annotation/inject';

const Controller = (ctr: any) => {
  if (Object.keys(helper.get(ctr)).length === 0) {
    throw new Error('必须在方法上注解@RequestMapping作为相应函数');
  }
  Resource({ type: 'single', isController: true })(ctr);
};

export default Controller;
