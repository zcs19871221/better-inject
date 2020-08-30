import { IncomingMessage } from 'http';
import RequestCondition from './request_condition';
import UrlPattern from './url_pattern';

export default class RequestUrlCondition extends RequestCondition {
  private parsedUrl: UrlPattern[];
  constructor(urls: (string | UrlPattern)[]) {
    super();
    this.parsedUrl = [...new Set(urls)].map(url =>
      typeof url === 'string' ? new UrlPattern(url) : url,
    );
    this.parsedUrl.sort((a, b) => a.compareTo(b));
  }

  isEmpty() {
    return this.parsedUrl.length > 0;
  }

  getContent() {
    return this.parsedUrl;
  }

  getMatchingCondition(req: IncomingMessage) {
    if (this.isEmpty()) {
      return this;
    }
    const matched = this.parsedUrl.filter(each => each.getMatchingCondition(req.url)
      if (matched.length === 0) {
        return null;
      }
    return new RequestUrlCondition(matched);
  }

  combine(other: RequestUrlCondition) {
    const res: UrlPattern[] = [];
    other.parsedUrl.forEach(toAppend => {
      this.parsedUrl.forEach(cur => {
        res.push(cur.combine(toAppend));
      });
    });
    return new RequestUrlCondition(res);
  }

  compareTo(other: RequestUrlCondition) {
    let i = 0;
    let j = 0;
    while (i < this.parsedUrl.length && j < other.parsedUrl.length) {
      const curUrl = this.parsedUrl[i];
      const otherUrl = other.parsedUrl[i];
      const compareRes = curUrl.compareTo(otherUrl);
      if (compareRes !== 0) {
        return compareRes;
      }
    }
    return other.parsedUrl.length - this.parsedUrl.length;
  }
}
