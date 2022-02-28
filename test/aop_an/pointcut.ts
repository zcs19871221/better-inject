import { Aspect, PointCut, Resource } from '../..';

@Aspect()
@Resource()
export default class GlobalPointCutClass {
  @PointCut(/c1/, /^get/)
  globalPointCutC1() {}
}
