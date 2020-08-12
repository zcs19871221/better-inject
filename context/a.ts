type YY =
  | {
      id: string;
      type: 'pointcut';
      classMatcher: RegExp;
      methodMatcher: RegExp;
    }
  | {
      adviceId: string;
      pointCutId: string;
      joinPoint: any[];
      type: 'aspect';
    };
const a: YY = {
  id: 'ssss',
  classMatcher: /ss/,
  methodMatcher: /ss/,
  type: 'pointcut',
};
