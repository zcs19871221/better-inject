// @ ts-nocheck
import {
  Initbinder,
  // ModelAttribute,
  CookieValue,
  PathVariable,
  RequestHeader,
  RequestParam,
  RequestBody,
  Method,
  // ResponseBody,
  // Controller,
  // RequestMapping,
} from '.';
// import { helper as iocHelper } from '../../annotation/inject';
import mvcHelper from './meta_helper';

it('Initbinder', () => {
  class Target {
    @Initbinder
    dataFormate() {}
  }
  expect(iocHelper.get(Target)).toEqual({
    type: 'single',
    parent: '',
    exposeProxy: false,
    id: 'target',
    beanClass: Target,
    autoInjectConstuct: {},
    constructParams: {},
    isController: true,
  });
});

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
    requestParam(@RequestParam() _id: String): void {}
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
          type: undefined,
          annotations: [],
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
  });
});

it('param check', () => {
  function Empty(_a: any, _b: any, _c: any) {}
  class Target {
    @Empty
    errorMethod(_a: Map<any, any>) {}
    @Empty
    requestBodyErrorType(_a: number, _b: Buffer, _c: string, _d: object) {}
    @Empty
    MethodCheck(_a: number, _b: Buffer, _c: string, _d: object) {}
  }
  expect(() => CookieValue('id')(Target, 'errormethod', 0)).toThrow();
  expect(() => RequestBody(Target, 'requestBodyErrorType', 0)).toThrow();
  expect(() => RequestBody(Target, 'requestBodyErrorType', 1)).not.toThrow();
  expect(() => RequestBody(Target, 'requestBodyErrorType', 2)).not.toThrow();
  expect(() => RequestBody(Target, 'requestBodyErrorType', 3)).not.toThrow();
  expect(() => Method(Target, 'MethodCheck', 0)).toThrow();
  expect(() => Method(Target, 'MethodCheck', 2)).not.toThrow();
});
