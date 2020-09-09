import { ResolveArgs } from './args_resolver';
import KeyValueArgsResolver from './key_value';

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
