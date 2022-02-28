import 'reflect-metadata';
export default abstract class MetaHelper<MetaDataType> {
  private metaKey: Symbol;

  constructor(metaKey: string) {
    this.metaKey = Symbol(metaKey);
  }

  abstract initMetaData(ctr: any): MetaDataType;

  getKey() {
    return this.metaKey;
  }

  set(ctr: any, metaData: MetaDataType) {
    ctr = this.getConstructor(ctr);
    Reflect.defineMetadata(this.metaKey, metaData, ctr);
  }

  getIfNotExisisInit(ctr: any): MetaDataType {
    ctr = this.getConstructor(ctr);
    return this.get(ctr) || this.initMetaData(ctr);
  }

  get(ctr: any): MetaDataType | undefined {
    ctr = this.getConstructor(ctr);
    return Reflect.getMetadata(this.metaKey, ctr);
  }

  getMethodParamTypes(
    proto: any,
    methodName: string,
    index?: number,
  ): any[] | undefined {
    proto = this.getPrototype(proto);
    const types = Reflect.getMetadata('design:paramtypes', proto, methodName);
    if (index !== undefined) {
      return types[index];
    }
    return types;
  }

  getMethodReturnType(proto: any, methodName: string): any | undefined {
    proto = this.getPrototype(proto);
    return Reflect.getMetadata('design:returntype', proto, methodName);
  }

  getMethodParam(ctr: any, methodName: string): { type: any; name: string }[] {
    const types = this.getMethodParamTypes(ctr, methodName);
    if (!types) {
      return [];
    }
    let names = this.getParamNames(this.getPrototype(ctr)[methodName]);
    if (names.length !== types.length) {
      names = new Array(types.length).fill('');
    }
    return types.map((type: any, index: number) => ({
      type,
      name: names[index],
    }));
  }

  getParamNames(func: object): string[] {
    const STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/gm;
    const ARGUMENT_NAMES = /([^\s,]+)/g;
    const fnStr = func.toString().replace(STRIP_COMMENTS, '');
    let result = fnStr
      .slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')'))
      .match(ARGUMENT_NAMES);
    if (result === null) result = [];
    return result;
  }

  protected getConstructor(target: any): any {
    if (target.hasOwnProperty('prototype')) {
      return target;
    }
    if (target.hasOwnProperty('constructor')) {
      return target.constructor;
    }
    throw new Error('不是类');
  }

  protected getPrototype(target: any): any {
    if (target.hasOwnProperty('constructor')) {
      return target;
    }
    if (target.hasOwnProperty('prototype')) {
      return target.prototype;
    }
    throw new Error('不是类');
  }
}
