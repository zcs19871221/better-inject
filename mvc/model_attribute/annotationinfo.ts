import { ParamAnnotationInfo } from '../param_resolver';
export default interface ModelAttributeAnnotationInfo
  extends ParamAnnotationInfo {
  type: 'ModelAttribute';
  modelKey: string;
  isRequired: boolean;
}
