import { IncomingMessage } from 'http';
import InfoParser from './request_condition';

class AcceptParser extends InfoParser {
  filterCondition(req: IncomingMessage) {
    return this.condition.filter(accept =>
      String(req.headers['accept']).includes(accept),
    );
  }

  createEntity(condition: string[]) {
    return new AcceptParser(condition);
  }
}
export default AcceptParser;
