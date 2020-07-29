function wrap({ doBefore, doBeforeReturn, doCatch, doAfter, origin }) {
  return function(...args: any[]) {
    try {
      if (doBefore) {
        args = doBefore(...args) || args;
      }
      const value = origin(...args);
      return doBeforeReturn(value);
    } catch (error) {
      if (error) {
        doCatch(error);
      }
    } finally {
      if (doAfter) {
        doAfter();
      }
    }
  };
}
function Before(func: (...args: any[]) => void | any[]) {
  return (_ctr: any, _name: string, desc: any) => {
    const origin = desc.value;
    return function() {};
  };
}
function After(func: (...args: any[]) => void | any[]) {
  return (_ctr: any, _name: string, desc: any) => {
    const origin = desc.value;
    desc.value = function(...args: any[]) {
      try {
        args = doBefore(...args) || args;
        const value = origin(...args);
        return doBeforeReturn(value);
      } catch (error) {
        doCatch();
      } finally {
        after();
      }
    };
  };
}
