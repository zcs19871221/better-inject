import AnnotationFactory from '../param_resolver/annotation_factory';
import ModelAttributeAnnotationInfo from './annotationinfo';

const Annotation = (
  modelKey: string = '',
  isRequired = true,
  ctr: any,
  methodName: string,
  index: number,
) => {
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
