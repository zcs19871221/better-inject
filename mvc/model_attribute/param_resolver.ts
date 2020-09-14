import { ResolveArgs } from '../param_resolver';
import KeyValueArgsResolver from '../param_resolver/key_value';

class ModelAttributeArgsResolver extends KeyValueArgsResolver {
  doResolve(input: ResolveArgs): any {
    return input.model.getModel(this.key);
  }
}

export const Annotation = KeyValueArgsResolver.AnnotationFactory(
  ModelAttributeArgsResolver,
  'ModelAttribute',
  [Map, String],
);
export default ModelAttributeArgsResolver;
