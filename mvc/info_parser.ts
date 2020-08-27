import { ClientRequest } from 'http';

export default interface InfoParser {
  match(req: ClientRequest): boolean;
  merge(parser: InfoParser): InfoParser;
}
