import RequestMappingInfo, {
  RequestMappingInfoArgs,
} from '../request_mapping_info';
import { helper } from '.';

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
  if (Object.keys(mvcMeta).length === 0) {
    throw new Error('没有方法定义RequestMapping');
  }
  Object.values(mvcMeta).forEach(data => {
    if (!data.info) {
      throw new Error('data.info错误');
    }
    data.info = info.combine(data.info);
  });
}

function handleMethod(ctr: any, methodName: string, info: RequestMappingInfo) {
  ctr = ctr.constructor;
  const mvcMeta = helper.getIfNotExisisInit(ctr, true);
  const methodMeta = helper.getOrInitMethodData(mvcMeta, methodName);
  methodMeta.info = info;
  methodMeta.params = helper.getMethodParam(ctr, methodName);
  helper.set(ctr, mvcMeta);
  return ctr;
}

export default RequestMapping;
