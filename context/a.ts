import Aspect from "aop/aspect";
import { Resource } from "context";
import Advice from "aop/advice";

interface POINT_CUT {
  id: string;
  type: 'pointcut';
  classMatcher: Matcher | Matcher[];
  methodMatcher: Matcher | Matcher[];
}

type ASPECT = {
  order?: number;
  joinPoint: [typeof JOIN_POINT[number], string?][];
   classMatcher: Matcher | Matcher[];
  methodMatcher: Matcher | Matcher[];
  type: 'aspect';
  adviceId: string;
};

@Aspect('id', {classMatcher, methodMatcher, order})
class A {

  @Before('id', classMatcher, mtehodMatcher)
  do() {
  
  }
}

ASPECT1 = {
  order?: number;
  joinPoint: [before][];
  // pointCutId: string;
  // matcher;
  type: 'aspect';
  adviceId: string;
};
ASPECT2 = {
  order?: number;
  joinPoint: [after][];
  // pointCutId: string;
  // matcher;
  type: 'aspect';
  adviceId: string;
};
@Aspect
class Aop {
  --
  @Before(pointcutid or classmatcher and methodMatcher)
  logArgs() {}

}

class Aop2 {


  @After('a', origin)
  logArgs() {}
}