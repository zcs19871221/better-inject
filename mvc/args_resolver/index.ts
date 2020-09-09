import { ServerResponse, IncomingMessage } from 'http';
import ModelView from '../model_view';
import DataBinder from '../data_binder';
import { helper } from '../annotation';

export interface ArgsResolver {
  resolve(input: ResolveArgs): any;
}
interface ResolveArgs {
  param: { type: any; name: string };
  req: IncomingMessage;
  res: ServerResponse;
  model: ModelView;
  binder: DataBinder;
}
// interface ArgsResolver
abstract class KeyValueArgsResolver implements ArgsResolver {
  protected key: string;
  protected isRequired: boolean;
  protected type: any;
  constructor(
    name: string,
    key: string,
    isRequired: boolean,
    type: any,
    acceptTypes: any[],
  ) {
    if (!acceptTypes.concat(Object).includes(type)) {
      throw new Error(
        `${name}不支持注入类型${type},只支持${acceptTypes.join(',')}`,
      );
    }
    this.key = key;
    this.isRequired = isRequired;
  }

  static AnnotationFactory(Ctr: any, name: string, acceptTypes: any[]) {
    return (key: string = '', isRequired = true) => {
      return (ctr: any, methodName: string, index: number) => {
        const resolver = new Ctr(
          name,
          key,
          isRequired,
          helper.getMethodParamTypes(ctr, methodName, index),
          acceptTypes,
        );
        const mvcMeta = helper.getIfNotExisisInit(ctr, true);
        const methodMeta = helper.getOrInitMethodData(mvcMeta, methodName);
        methodMeta.argsResolverInfo.push(resolver);
      };
    };
  }

  resolve(input: ResolveArgs): any {
    const value = this.doResolve(input);
    this.checkValue(value);
    return input.binder.convert(value, input.param.type, input.param.name);
  }

  protected abstract doResolve(input: ResolveArgs): any;

  protected checkValue(value: any) {
    if (value === undefined && this.isRequired) {
      throw new Error(`${name}的键${this.key}值不存在`);
    }
  }
}

class PathVariableResolver extends KeyValueArgsResolver {
  static Annotation() {
    return KeyValueArgsResolver.AnnotationFactory(
      PathVariableResolver,
      'PathVariable',
      [Map, String],
    );
  }

  doResolve(input: ResolveArgs): any {
    const pathMap = input.req.requestMappingInfo.getPathVariableMap();
    let value;
    if (this.key) {
      value = pathMap.get(this.key);
    } else {
      value = pathMap;
    }
    return value;
  }
}

class ModalAttributeArgsResolver extends KeyValueArgsResolver {
  static Annotation() {
    return KeyValueArgsResolver.AnnotationFactory(
      ModalAttributeArgsResolver,
      'ModelAttribute',
      [Map, String],
    );
  }

  doResolve(input: ResolveArgs): any {
    return input.model.getModel(this.key);
  }
}

class RequestHeader extends KeyValueArgsResolver {
  static Annotation() {
    return KeyValueArgsResolver.AnnotationFactory(
      RequestHeader,
      'RequestHeader',
      [String],
    );
  }

  doResolve(input: ResolveArgs): any {
    const headers = input.req.headers;
    let value;
    if (this.key) {
      value = headers[this.key];
    } else {
      value = headers;
    }
    return value;
  }
}

class RequestParam extends KeyValueArgsResolver {
  static Annotation() {
    return KeyValueArgsResolver.AnnotationFactory(
      RequestParam,
      'RequestParam',
      [String],
    );
  }

  doResolve(input: ResolveArgs): any {
    const params = input.req.params;
    let value;
    if (this.key) {
      value = params[this.key];
    } else {
      value = params;
    }
    return value;
  }
}

class Method implements ArgsResolver {
  static Annotation(ctr: any, methodName: string, index: number) {
    const mvcMeta = helper.getIfNotExisisInit(ctr, true);
    const methodMeta = helper.getOrInitMethodData(mvcMeta, methodName);
    methodMeta.argsResolverInfo.push(new Method());
  }

  resolve(input: ResolveArgs) {
    const value = input.req.method;
    if (value === undefined) {
      throw new Error('method undefined');
    }
    return value;
  }
}
