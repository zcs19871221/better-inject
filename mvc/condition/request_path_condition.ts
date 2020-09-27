import { IncomingMessage } from 'http';
import RequestCondition from './request_condition';
import PathPattern from './path_pattern';

export default class RequestPathCondition extends RequestCondition<
  PathPattern,
  RequestPathCondition
> {
  constructor(urls: (string | PathPattern)[]) {
    const parsedUrl = [...new Set(urls)].map(url =>
      typeof url === 'string' ? new PathPattern(url) : url,
    );
    parsedUrl.sort((a, b) => a.compareTo(b));
    super(parsedUrl);
  }

  protected createhashCode() {
    return 'path:' + this.contents.map(each => each.hashCode()).join('||');
  }

  getVariableMap() {
    const res: Map<string, string> = new Map();
    this.contents.forEach(content => {
      for (const [key, value] of content.getVariableMap()) {
        res.set(key, value);
      }
    });
    return res;
  }

  filterPureUrl() {
    return this.contents
      .filter(each => each.isPureUrlPattern())
      .map(each => each.getContent());
  }

  doGetMatchingCondition(req: IncomingMessage) {
    const matched: PathPattern[] = [];
    this.getContent().forEach(each => {
      const t = each.getMatchingCondition(String(req.url).replace(/\?.*/, ''));
      if (t !== null) {
        matched.push(t);
      }
    });
    return matched;
  }

  doCombine(other: RequestPathCondition): PathPattern[] {
    const res: PathPattern[] = [];
    other.getContent().forEach(toAppend => {
      this.getContent().forEach(cur => {
        res.push(cur.combine(toAppend));
      });
    });
    return res;
  }

  doCompareTo(other: RequestPathCondition) {
    let i = 0;
    let j = 0;
    while (i < this.getContent().length && j < other.getContent().length) {
      const curUrl = this.getContent()[i];
      const otherUrl = other.getContent()[i];
      const compareRes = curUrl.compareTo(otherUrl);
      if (compareRes !== 0) {
        return compareRes;
      }
      i++;
      j++;
    }
    return other.getContent().length - this.getContent().length;
  }
}
