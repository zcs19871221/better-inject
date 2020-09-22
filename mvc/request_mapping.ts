import { ServerResponse } from 'http';
import RequestMappingInfo, {
  RequestMappingInfoArgs,
} from './request_mapping_info';
import helper from './annotation/meta_helper';
import ModelView from './model_view';
import { MvcMeta } from '.';

const RequestMapping = (args: Omit<RequestMappingInfoArgs, 'type'> = {}) => (
  ctr: any,
  methodName?: string,
) => {
  const info = new RequestMappingInfo({ ...args, type: 'init' });
  if (methodName) {
    handleMethod(ctr, methodName, info);
  } else {
    handleClass(ctr, info);
  }
};
const filterAndCheckMapping = (mvcMeta: MvcMeta) => {
  mvcMeta.methods = Object.entries(mvcMeta.methods).reduce(
    (acc: MvcMeta['methods'], cur) => {
      if (cur[1].mappingInfo !== undefined) {
        acc[cur[0]] = cur[1];
      }
      return acc;
    },
    {},
  );
  if (Object.keys(mvcMeta.methods).length === 0) {
    throw new Error('没有方法定义RequestMapping');
  }
};
function handleClass(ctr: any, info: RequestMappingInfo) {
  const mvcMeta = helper.getIfNotExisisInit(ctr);
  filterAndCheckMapping(mvcMeta);
  Object.values(mvcMeta.methods).forEach(data => {
    if (!data.mappingInfo) {
      throw new Error('data.mappingInfo');
    }
    data.mappingInfo = info.combine(data.mappingInfo);
  });
  helper.set(ctr, mvcMeta);
}

function handleMethod(ctr: any, methodName: string, info: RequestMappingInfo) {
  const mvcMeta = helper.getIfNotExisisInit(ctr);
  const methodMeta = helper.getOrInitMethodData(mvcMeta, methodName, ctr);
  methodMeta.mappingInfo = info;
  const returnType = helper.getMethodReturnType(ctr, methodName);
  if (
    returnType === undefined &&
    !methodMeta.paramInfos.find(e => e.type === ServerResponse)
  ) {
    throw new Error('返回值void必须设置参数ServerResponse类型来手动处理返回');
  }
  methodMeta.returnInfo.type = returnType;
  if (
    ![String, ModelView, undefined].includes(returnType) &&
    !methodMeta.returnInfo.annotations.find(e => e.type === 'ResponseBody')
  ) {
    throw new Error(
      '返回值只支持String ModelView void或者ResponseBody注解后的Buffer string Object类型',
    );
  }
  helper.set(ctr, mvcMeta);
}

export default RequestMapping;
export { filterAndCheckMapping };
