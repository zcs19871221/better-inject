import { ResolveArgs } from '../args_resolver/args_resolver';
import KeyValueArgsResolver from '../args_resolver/key_value';

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
