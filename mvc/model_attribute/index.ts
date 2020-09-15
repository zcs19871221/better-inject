import MethodAnnotation from './method_annotation';
import ParamAnnotation from './param_annotation';
import Resolver from './param_resolver';

const Annotation = (modelKey: string = '', isRequired: boolean = true) => (
  ctr: any,
  method: string,
  index?: number,
) => {
  if (index === undefined) {
    return MethodAnnotation(modelKey)(ctr, method);
  }
  return ParamAnnotation(modelKey, isRequired)(ctr, method, index);
};
export default Resolver;
export { Annotation };
