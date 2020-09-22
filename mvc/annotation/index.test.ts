import {
  Initbinder,
  ModelAttribute,
  CookieValue,
  PathVariable,
  RequestHeader,
  RequestParam,
  RequestBody,
  Method,
  ResponseBody,
  // Controller,
  RequestMapping,
} from '.';
// import { helper as iocHelper } from '../../annotation/inject';
import mvcHelper from './meta_helper';
import RequestMappingInfo from '../request_mapping_info';
import ModelView from '../model_view';
import { ServerResponse } from 'http';

it('Param Annotation', () => {
  class Target {
    cookieValue(@CookieValue() _jessionid: string): string {
      return '';
    }
    pathVariable(
      @PathVariable('', false) _allPathMap: Map<string, string>,
    ): void {}
    requestHeader(@RequestHeader('accept') _oneKey: String): number {
      return 1;
    }
    @ResponseBody
    requestParam(@RequestParam() _id: String): Buffer {
      return new Buffer('sdffs');
    }
    requestBody(@RequestBody _name: Buffer): void {}
    method(@Method _method: any): void {}
  }
  expect(mvcHelper.get(Target)).toEqual({
    methods: {
      cookieValue: {
        returnInfo: {
          type: String,
          annotations: [],
        },
        paramInfos: [
          {
            type: String,
            name: '_jessionid',
            annotations: [
              {
                type: 'CookieValue',
                isRequired: true,
                key: '_jessionid',
              },
            ],
          },
        ],
      },
      pathVariable: {
        returnInfo: {
          type: undefined,
          annotations: [],
        },
        paramInfos: [
          {
            type: Map,
            name: '_allPathMap',
            annotations: [
              {
                type: 'PathVariable',
                isRequired: false,
                key: '',
              },
            ],
          },
        ],
      },
      requestHeader: {
        returnInfo: {
          type: Number,
          annotations: [],
        },
        paramInfos: [
          {
            type: String,
            name: '_oneKey',
            annotations: [
              {
                type: 'RequestHeader',
                isRequired: true,
                key: 'accept',
              },
            ],
          },
        ],
      },
      requestParam: {
        returnInfo: {
          type: Buffer,
          annotations: [
            {
              type: 'ResponseBody',
            },
          ],
        },
        paramInfos: [
          {
            type: String,
            name: '_id',
            annotations: [
              {
                type: 'RequestParam',
                isRequired: true,
                key: '_id',
              },
            ],
          },
        ],
      },
      requestBody: {
        returnInfo: {
          type: undefined,
          annotations: [],
        },
        paramInfos: [
          {
            type: Buffer,
            name: '_name',
            annotations: [
              {
                type: 'RequestBody',
              },
            ],
          },
        ],
      },
      method: {
        returnInfo: {
          type: undefined,
          annotations: [],
        },
        paramInfos: [
          {
            type: Object,
            name: '_method',
            annotations: [
              {
                type: 'Method',
              },
            ],
          },
        ],
      },
    },
    modelIniter: [],
    initBinder: [],
    requestMappingMethods: [],
  });
});

it('Initbinder', () => {
  class Target {
    @Initbinder
    dataFormate() {}
  }
  expect(mvcHelper.get(Target)).toEqual({
    methods: {},
    initBinder: [
      {
        methodName: 'dataFormate',
        beanClass: Target,
      },
    ],
    modelIniter: [],
    requestMappingMethods: [],
  });
  class Target2 {
    @Initbinder
    dataFormate(@Method _method: string) {}
  }
  expect(mvcHelper.get(Target2)).toEqual({
    methods: {
      dataFormate: {
        returnInfo: {
          type: undefined,
          annotations: [],
        },
        paramInfos: [
          {
            type: String,
            name: '_method',
            annotations: [
              {
                type: 'Method',
              },
            ],
          },
        ],
      },
    },
    initBinder: [
      {
        methodName: 'dataFormate',
        beanClass: Target2,
      },
    ],
    modelIniter: [],
    requestMappingMethods: [],
  });
});

it('ModelAttribute with Method', () => {
  class Target {
    @ModelAttribute('abcd')
    dataFormate(): string {
      return '';
    }

    @ModelAttribute()
    model2(): Target {
      return this;
    }

    @ModelAttribute()
    model3() {
      return this;
    }
  }
  expect(mvcHelper.get(Target)).toEqual({
    methods: {},
    initBinder: [],
    modelIniter: [
      {
        methodName: 'dataFormate',
        modelKey: 'abcd',
        beanClass: Target,
      },
      {
        methodName: 'model2',
        modelKey: 'target',
        beanClass: Target,
      },
      {
        methodName: 'model3',
        modelKey: '',
        beanClass: Target,
      },
    ],
    requestMappingMethods: [],
  });
});

it('response type check', () => {
  function Empty(_a: any, _b: any, _c: any) {}
  class Target {
    @Empty
    errorType(_a: Map<any, any>): string[] {
      return [];
    }
  }
  expect(() => ResponseBody(Target, 'errorType')).toThrow();
});

it('RequestMapping method', () => {
  class Target {
    @RequestMapping()
    mapping(_a: Map<any, any>): string {
      return 'person.pug';
    }
  }
  const meta = mvcHelper.get(Target);
  const info = meta?.methods.mapping.mappingInfo;
  delete meta?.methods.mapping.mappingInfo;
  expect(info).toEqual(new RequestMappingInfo({ type: 'init' }));
  expect(meta).toEqual({
    methods: {
      mapping: {
        returnInfo: {
          type: String,
          annotations: [],
        },
        paramInfos: [
          {
            type: Map,
            name: '_a',
            annotations: [],
          },
        ],
      },
    },
    initBinder: [],
    modelIniter: [],
    requestMappingMethods: [],
  });
});

it('RequestMapping class', () => {
  class Target {
    mapping(@CookieValue() _a: string): string {
      return 'person.pug';
    }
  }
  expect(() => RequestMapping()(Target)).toThrow('没有方法定义RequestMapping');
  @RequestMapping({ path: '/user' })
  class Target2 {
    @RequestMapping({ path: '/get' })
    mapping(@CookieValue() _a: string): string {
      return 'person.pug';
    }
  }
  const meta = mvcHelper.get(Target2);
  const info = meta?.methods.mapping.mappingInfo;
  delete meta?.methods.mapping.mappingInfo;
  expect(info).toEqual(
    new RequestMappingInfo({ type: 'init', path: '/user/get' }),
  );
  expect(meta).toEqual({
    methods: {
      mapping: {
        returnInfo: {
          type: String,
          annotations: [],
        },
        paramInfos: [
          {
            type: String,
            name: '_a',
            annotations: [
              {
                type: 'CookieValue',
                isRequired: true,
                key: '_a',
              },
            ],
          },
        ],
      },
    },
    initBinder: [],
    modelIniter: [],
    requestMappingMethods: [],
  });
});

it('RequestMapping check', () => {
  function Empty(_a: any, _b: any, _c: any) {}

  class Target {
    @Empty
    mapping(_a: Map<any, any>): string {
      return 'person.pug';
    }
    @Empty
    mapping1(_a: ModelView): ModelView {
      return _a;
    }
    @ResponseBody
    mapping2(_a: ServerResponse): Buffer {
      return new Buffer('ss');
    }
    @ResponseBody
    mapping3(_a: ServerResponse): string {
      return '{name:"zcs"}';
    }
    @ResponseBody
    mapping4(_a: ServerResponse): object {
      return { name: 'zcs' };
    }
    mapping5(): void {}
    mapping6(_a: ServerResponse): number {
      return 1;
    }
  }
  expect(() => RequestMapping()(Target, 'mapping')).not.toThrow();
  expect(() => RequestMapping()(Target, 'mapping1')).not.toThrow();
  expect(() => RequestMapping()(Target, 'mapping2')).not.toThrow();
  expect(() => RequestMapping()(Target, 'mapping3')).not.toThrow();
  expect(() => RequestMapping()(Target, 'mapping4')).not.toThrow();
  expect(() => RequestMapping()(Target, 'mapping5')).toThrow();
});
