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
    Reflect.defineMetadata(this.metaKey, metaData, ctr);
  }

  getIfNotExisisInit(ctr: any, isPrototype = false): MetaDataType {
    if (isPrototype) {
      ctr = ctr.constructor;
    }
    return this.get(ctr) || this.initMetaData(ctr);
  }

  get(ctr: any): MetaDataType | undefined {
    return Reflect.getMetadata(this.metaKey, ctr);
  }

  getMethodParamTypes(ctr: any, methodName: string, index?: number) {
    const types = Reflect.getMetadata('design:paramtypes', ctr, methodName);
    if (index !== undefined) {
      return types[index];
    }
    return types;
  }

  getMethodReturnType(ctr: any, methodName: string) {
    return Reflect.getMetadata('design:returntype', ctr, methodName);
  }

  getMethodParam(ctr: any, methodName: string): { type: any; name: string }[] {
    const types = this.getMethodParamTypes(ctr, methodName);
    let names = this.getParamNames(ctr[methodName]);
    if (names.length !== types.length) {
      names = new Array(types.length).fill('');
    }
    return types.map((type: any, index: number) => ({
      type,
      name: names[index],
    }));
  }

  getParamNames(func: object) {
    const STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/gm;
    const ARGUMENT_NAMES = /([^\s,]+)/g;
    const fnStr = func.toString().replace(STRIP_COMMENTS, '');
    let result = fnStr
      .slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')'))
      .match(ARGUMENT_NAMES);
    if (result === null) result = [];
    return result;
  }
}
