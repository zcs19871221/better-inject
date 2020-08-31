import MetaHelper from './metaHelper';
import RequestMappingInfo, {
  RequestMappingInfoArgs,
} from '../mvc/request_mapping_infots';
import { Resource } from './inject';

interface MvcMeta {
  [method: string]: {
    info: RequestMappingInfo;
    argsResolvers: [];
    returnValueResolvers: [];
  };
}

class MvcHelper extends MetaHelper<MvcMeta> {
  constructor() {
    super('__mvc meta data');
  }

  initMetaData() {
    return {};
  }
}

const helper = new MvcHelper();

const Controller = (ctr: any) => {
  if (Object.keys(helper.get(ctr)).length === 0) {
    throw new Error('必须在方法上注解@RequestMapping作为相应函数');
  }
  Resource({ type: 'single', isController: true })(ctr);
};

const RequestMapping = (args: RequestMappingInfoArgs) => (
  ctr: any,
  methodName?: string,
) => {
  const info = new RequestMappingInfo(args);
  if (methodName) {
    ctr = ctr.constructor;
    const mvcMeta = helper.get(ctr);
    if (!mvcMeta[methodName]) {
      mvcMeta[methodName] = {
        info: info,
        argsResolvers: [],
        returnValueResolvers: [],
      };
    } else {
      mvcMeta[methodName].info = info;
    }
    helper.set(ctr, mvcMeta);
  } else {
    const mvcMeta = helper.get(ctr);
    if (Object.keys(mvcMeta).length === 0) {
      throw new Error('没有方法定义RequestMapping');
    }
    Object.values(mvcMeta).forEach(data => {
      data.info = info.merge(data.info);
    });
  }
};

export { Controller, helper, RequestMapping };
