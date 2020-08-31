import { IncomingMessage } from 'http';
import RequestMimeTypeCondition from './request_mimetype_condition';

export default class RequestContentTypeCondition extends RequestMimeTypeCondition<
  RequestContentTypeCondition
> {
  protected createhashCode() {
    return (
      'contentType:' + this.contents.map(each => each.hashCode()).join('||')
    );
  }

  doGetMatchingCondition(req: IncomingMessage) {
    const contentType = req.headers['content-type'];
    if (!contentType) {
      return this.contents;
    }
    const contentTypes = this.parseContentType(contentType);
    return this.contents.filter(expr => {
      return contentTypes.some(value => expr.match(value));
    });
  }

  doCompareTo(other: RequestContentTypeCondition) {
    return this.getContent()[0].compareTo(other.getContent()[0]);
  }

  private parseContentType(contentType: string) {
    return contentType
      .split(';')
      .filter(each => each.trim() && each.includes('/'))
      .map(each => each.trim().toLowerCase());
  }
}
