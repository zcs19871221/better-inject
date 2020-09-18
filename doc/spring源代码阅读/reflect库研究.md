type X = 'a' | 'b' | 'c';
这个获取参数类型是 string

type Y = [string, number];
这个获取参数类型是 Array

获取返回值类型，完全根据手写的返回值，而不管实际返回值。

      return1() {
        return 'string';
      }
      返回类型 undefined

      return4(): this {
        return this;
      }
      返回类型 Object
