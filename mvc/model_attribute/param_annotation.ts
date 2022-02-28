import AnnotationFactory from '../param_resolver/annotation_factory';
import ModelAttributeAnnotationInfo from './annotationinfo';
import helper from '../meta_helper';

const Annotation = (
  modelKey: string = '',
  isRequired = true,
  ctr: any,
  methodName: string,
  index: number,
) => {
  const param = helper.getMethodParam(ctr, methodName)[index];
  if (!modelKey) {
    modelKey = param.name;
  }
  return AnnotationFactory<ModelAttributeAnnotationInfo>(
    ctr,
    methodName,
    index,
    {
      type: 'ModelAttribute',
      isRequired,
      modelKey,
    },
  );
};
export default Annotation;
