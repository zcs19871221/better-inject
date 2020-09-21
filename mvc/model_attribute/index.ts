import MethodAnnotation from './method_annotation';
import ParamAnnotation from './param_annotation';
import Resolver from './param_resolver';

const Annotation = (modelKey: string = '', isRequired: boolean = true) => (
  ctr: any,
  method: string,
  index?: any,
): void => {
  if (index === undefined) {
    return MethodAnnotation(modelKey)(ctr, method);
  }
  return ParamAnnotation(modelKey, isRequired)(ctr, method, Number(index));
};
export default Resolver;
export { Annotation };
