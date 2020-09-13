import RequestMappingInfo, {
  RequestMappingInfoArgs,
} from '../request_mapping_info';
import helper from './helper';
import ModelView from '../model_view';
import { ResponseBodyHandler } from '../returnvalue_handler/response_body';
import { ServerResponse } from 'http';

const RequestMapping = (args: Omit<RequestMappingInfoArgs, 'type'>) => (
  ctr: any,
  methodName?: string,
) => {
  const info = new RequestMappingInfo({ ...args, type: 'init' });
  if (methodName) {
    ctr = handleMethod(ctr, methodName, info);
  } else {
    handleClass(ctr, info);
  }
};

function handleClass(ctr: any, info: RequestMappingInfo) {
  const mvcMeta = helper.getIfNotExisisInit(ctr);
  if (Object.keys(mvcMeta.methods).length === 0) {
    throw new Error('没有方法定义RequestMapping');
  }
  Object.values(mvcMeta.methods).forEach(data => {
    if (!data.info) {
      throw new Error('data.info错误');
    }
    data.info = info.combine(data.info);
  });
  helper.set(ctr, mvcMeta);
}

function handleMethod(ctr: any, methodName: string, info: RequestMappingInfo) {
  ctr = ctr.constructor;
  const mvcMeta = helper.getIfNotExisisInit(ctr, true);
  const methodMeta = helper.getOrInitMethodData(mvcMeta, methodName);
  methodMeta.info = info;
  methodMeta.params = helper.getMethodParam(ctr.prototype, methodName);
  const returnType = helper.getMethodReturnType(ctr.prototype, methodName);
  if (
    returnType === undefined &&
    !methodMeta.params.find(e => e.type === ServerResponse)
  ) {
    throw new Error('返回值void必须设置参数ServerResponse类型来手动处理返回');
  }
  if (
    ![String, ModelView, undefined].includes(returnType) ||
    !methodMeta.returnValueHandler.find(e => e instanceof ResponseBodyHandler)
  ) {
    throw new Error(
      '返回值只支持String ModelView void或者ResponseBody注解后的Buffer Object类型',
    );
  }
  helper.set(ctr, mvcMeta);
  return ctr;
}

export default RequestMapping;
