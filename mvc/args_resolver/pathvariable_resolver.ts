import ArgsResolver from './args_resolver';
interface PathVariableResolverInfo {
  pathVariableName: string;
}

const resolver: ArgsResolver<PathVariableResolverInfo> = (
  paramInfo,
  model,
  request,
  args,
) => {
  const name = args.pathVariableName;
  const info = request.requestMappingInfo;
  const variableMap = info.getPathCondition().getVariableMap();
  return variableMap.get(name);
};
