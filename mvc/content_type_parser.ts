import { IncomingMessage } from 'http';
import InfoParser from './info_parser';

class ContentTypeParser extends InfoParser {
  filterCondition(req: IncomingMessage) {
    return this.condition.filter(contentType =>
      String(req.headers['content-type']).includes(contentType),
    );
  }

  createEntity(condition: string[]) {
    return new ContentTypeParser(condition);
  }
}
export default ContentTypeParser;
