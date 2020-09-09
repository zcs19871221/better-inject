interface Binder {
  type: string;
  name: string;
  editor: (data: any) => any;
}
export default class DataBinder {
  private converters: Binder[] = [];
  private validaters: Binder[] = [];

  addConveter(obj: Binder) {
    this.converters.push(obj);
  }

  addValidater(obj: Binder) {
    this.validaters.push(obj);
  }

  private run(data: any, type: any, name: string, binderList: Binder[]) {
    const binders = binderList.filter(e => {
      if (e.type && e.type !== type) {
        return false;
      }
      if (e.name && e.name !== name) {
        return false;
      }
    });
    if (binders.length > 0) {
      let binder = binders[0];
      return binder.editor(data);
    }
    return data;
  }

  convert(data: any, type: any, name: string): any {
    return this.run(data, type, name, this.converters);
  }

  validate(data: string, type: any, name: string): any {
    return this.run(data, type, name, this.validaters);
  }
}
