export default class ModelView {
  private view: any;
  private model: Map<string, any> = new Map();

  getView() {
    return this.view;
  }

  addModel(key: string, value: any) {
    this.model.set(key, value);
  }

  getModel() {
    return this.model;
  }
}
