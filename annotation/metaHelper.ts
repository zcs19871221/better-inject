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

  get(ctr: any): MetaDataType {
    return Reflect.getMetadata(this.metaKey, ctr) || this.initMetaData(ctr);
  }
}
