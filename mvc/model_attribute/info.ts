import { ParamAnnotationInfo } from '../param_resolver/resolver';
export default interface ModelAttributeAnnotationInfo
  extends ParamAnnotationInfo {
  type: 'ModelAttribute';
  modelKey: string;
  isRequired: boolean;
}
