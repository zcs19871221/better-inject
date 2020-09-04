import ArgsResolver from './args_resolver';
interface PathVariableResolverInfo {
  pathVariableName?: string;
}

const resolver: ArgsResolver<PathVariableResolverInfo> = (
  paramINfo,
  model,
  request,
  args,
) => {
  const name = args.pathVariableName;
};
