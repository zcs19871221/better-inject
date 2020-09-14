export default class ModelView {
  private view: any;
  private model: Map<string, any> = new Map();

  getView() {
    return this.view;
  }

  setView(viewPath: string) {
    this.view = viewPath;
  }

  setModel(key: string, value: any) {
    this.model.set(key, value);
  }

  getModel(key: string): string | Map<string, any> {
    if (!key) {
      return this.model;
    }
    return this.model.get(key);
  }

  combine(modelView: ModelView) {
    this.model = new Map([...this.model, ...modelView.model]);
    this.view = modelView.view;
  }
}
