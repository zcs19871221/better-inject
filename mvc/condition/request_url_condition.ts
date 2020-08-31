import { IncomingMessage } from 'http';
import RequestCondition from './request_condition';
import UrlPattern from './url_pattern';

export default class RequestUrlCondition extends RequestCondition<UrlPattern> {
  constructor(urls: (string | UrlPattern)[]) {
    const parsedUrl = [...new Set(urls)].map(url =>
      typeof url === 'string' ? new UrlPattern(url) : url,
    );
    parsedUrl.sort((a, b) => a.compareTo(b));
    super(parsedUrl);
  }

  protected createhashCode() {
    return 'path:' + this.contents.map(each => each.hashCode()).join('||');
  }

  doGetMatchingCondition(req: IncomingMessage) {
    const matched = this.getContent().filter(each =>
      each.getMatchingCondition(String(req.url)),
    );
    return matched;
  }

  doCombine(other: RequestUrlCondition) {
    const res: UrlPattern[] = [];
    other.getContent().forEach(toAppend => {
      this.getContent().forEach(cur => {
        res.push(cur.combine(toAppend));
      });
    });
    return res;
  }

  doCompareTo(other: RequestUrlCondition) {
    let i = 0;
    let j = 0;
    while (i < this.getContent().length && j < other.getContent().length) {
      const curUrl = this.getContent()[i];
      const otherUrl = other.getContent()[i];
      const compareRes = curUrl.compareTo(otherUrl);
      if (compareRes !== 0) {
        return compareRes;
      }
    }
    return other.getContent().length - this.getContent().length;
  }
}
