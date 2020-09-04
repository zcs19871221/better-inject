interface ArgsResolver {
  (paramType, model, request, dataConverter): any;
}
interface ReturnValueREsolver {
  (returnValue, returnType, mode, reqeust);
}
