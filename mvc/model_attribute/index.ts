import MethodAnnotation from './method_annotation';
import { Annotation as ParamAnnotation } from './args_resolver';

const ModelAttribute = (key: string = '') => (
  ctr: any,
  method: string,
  index?: number,
) => {
  if (index === undefined) {
    return MethodAnnotation(key)(ctr, method);
  }
  return ParamAnnotation(key, true)(ctr, method, index);
};
export default ModelAttribute;
