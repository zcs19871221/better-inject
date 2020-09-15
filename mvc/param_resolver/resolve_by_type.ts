import ParamResolver, {
  ResolveParamArgs,
  ParamAnnotationInfo,
  ParamInfo,
} from './resolver';
import { ServerResponse, IncomingMessage } from 'http';
import ModelView from '../model_view';
import WebRequest from '../webrequest';

interface TypePlaceholder extends ParamAnnotationInfo {
  type: 'TypeAnnotation';
}
export default class ParamTypeResolver
  implements ParamResolver<TypePlaceholder> {
  private targetType = [IncomingMessage, ServerResponse, ModelView, WebRequest];

  Annotation() {
    throw new Error('不应该有注解');
  }

  getAnnotationInfo(_paramInfo: ParamInfo): null {
    return null;
  }

  resolve(resolveParamArgs: ResolveParamArgs) {
    switch (resolveParamArgs.param.type) {
      case IncomingMessage:
        return resolveParamArgs.webRequest.getRequest();
      case ServerResponse:
        return resolveParamArgs.webRequest.getResponse();
      case WebRequest:
        return resolveParamArgs.webRequest;
      case ModelView:
        return resolveParamArgs.model;
      default:
        throw new Error('错误参数类型，查看support函数');
    }
  }

  isSupport(paramInfo: ParamInfo) {
    return this.targetType.includes(paramInfo.type);
  }
}
