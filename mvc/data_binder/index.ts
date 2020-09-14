import { ParamInfo, BinderInfo } from '..';
import BeanFactory from '../../factory';

interface Binder {
  type: string;
  name: string;
  editor: (data: any) => any;
}
export default class DataBinder {
  private converters: Binder[] = [];

  constructor(binderInfo: BinderInfo[], factory: BeanFactory) {
    binderInfo.forEach(info => {
      factory.getBeanFromClass(info.beanClass)[info.methodName](this);
    });
  }

  addConveter(obj: Binder) {
    this.converters.push(obj);
  }

  convert(value: any, param: ParamInfo) {
    const binder = this.converters.find(e => {
      return e.type === param.type && (!e.name || e.name === param.name);
    });
    if (!binder) {
      return value;
    }
    return binder.editor(value);
  }
}
