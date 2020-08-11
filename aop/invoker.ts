interface Invoker {
  getProxy: () => any;
  getArgs: () => any[];
  callOrigin: () => any;
  getTargetMethod: () => any;
  invoke: () => any;
}
export default Invoker;
