interface Factory<T> {
  get(name: string): T;
  has(name: string): boolean;
  getAliases(name: string): string[];
  isSingleton(name: string): boolean;
  isPrototype(name: string): boolean;
}
