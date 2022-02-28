type Matcher = String | RegExp;
type MatcherGroup = Matcher | Matcher[];
interface POINT_CUT_MATCHER {
  classMatcher: MatcherGroup;
  methodMatcher: MatcherGroup;
}
interface POINT_CUT extends POINT_CUT_MATCHER {
  id: string;
}
export default POINT_CUT;
export { Matcher, POINT_CUT_MATCHER, MatcherGroup };
