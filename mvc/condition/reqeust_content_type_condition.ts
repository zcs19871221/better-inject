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
    const mimeType = this.parseContentType(contentType);
    return this.contents.filter(expr => expr.match(mimeType));
  }

  doCompareTo(other: RequestContentTypeCondition) {
    return this.getContent()[0].compareTo(other.getContent()[0]);
  }

  private parseContentType(contentType: string) {
    const t = contentType
      .split(';')
      .find(each => each.trim() && each.includes('/'));
    if (!t) {
      throw new Error('content-type:' + contentType + '没有有效mimetype');
    }
    return t.trim();
  }
}
