export default class ModelView {
  private view: string = '';
  private model: Map<string, any> = new Map();

  getView() {
    return this.view;
  }

  hasView() {
    return this.view.trim() !== '';
  }

  setView(viewPath: string) {
    this.view = viewPath;
  }

  setModel(key: string, value: any) {
    this.model.set(key, value);
  }

  getModel(): Map<string, any> {
    return this.model;
  }

  getModelObject(): object {
    return [...this.model.entries()].reduce((acc: any, cur) => {
      acc[cur[0]] = cur[1];
      return acc;
    }, {});
  }

  combine(modelView: ModelView) {
    this.model = new Map([...this.model, ...modelView.model]);
    this.view = modelView.view;
  }
}
