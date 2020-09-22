import 'reflect-metadata';
import { ModelAttribute } from '../mvc/annotation';
// import { helper as iocHelper } from '../../annotation/inject';
import mvcHelper from '../mvc/annotation/meta_helper';
class Target {
  @ModelAttribute('abcd', true)
  dataFormate(_a: string): any {}
}
const x = mvcHelper.get(Target);
console.log(x);
