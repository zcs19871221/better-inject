export default class MetaHelper<MetaDataType> {
  private metaKey: Symbol;

  constructor(metaKey: Symbol) {
    this.metaKey = metaKey;
  }

  getKey() {
    return this.metaKey;
  }

  set(ctr: any, metaData: MetaDataType) {
    Reflect.defineMetadata(this.metaKey, metaData, ctr);
  }

  get(ctr: any): MetaDataType | undefined {
    return Reflect.getMetadata(this.metaKey, ctr);
  }
}
