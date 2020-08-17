import POINT_CUT from './point_cut';

interface ASPECT_ARGS {
  id: string;
  pointCuts?: POINT_CUT[];
  order?: number;
}

export { ASPECT_ARGS };
export default class Aspect {
  private id: string;
  private pointCuts: POINT_CUT[];
  private order: number;

  constructor({ id, pointCuts = [], order = 0 }: ASPECT_ARGS) {
    this.id = id;
    this.pointCuts = pointCuts;
    this.order = order;
  }

  getPointCuts() {
    return this.pointCuts;
  }

  getId() {
    return this.id;
  }

  getOrder() {
    return this.order;
  }
}
