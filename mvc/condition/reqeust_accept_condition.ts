import { IncomingMessage } from 'http';
import RequestMimeTypeCondition from './request_mimetype_condition';

export default class RequestAcceptCondition extends RequestMimeTypeCondition {
  protected createhashCode() {
    return 'accept:' + this.contents.map(each => each.hashCode()).join('||');
  }

  doGetMatchingCondition(req: IncomingMessage) {
    const accept = req.headers.accept;
    if (!accept) {
      return this.contents;
    }
    const accepts = this.parseAccepts(accept);
    return this.contents.filter(accpetExpression => {
      return accepts.some(acceptValue => accpetExpression.match(acceptValue));
    });
  }

  doCompareTo(other: RequestAcceptCondition, req: IncomingMessage) {
    const accept = req.headers.accept;
    if (!accept) {
      return 0;
    }
    const accepts = this.parseAccepts(accept);
    /* 按照请求accpet优先级顺序遍历，先遍历两者完全匹配的，越靠前优先级越高，然后比较match的，最后两个express比较 */
    for (const accept of accepts) {
      let iIndex = this.contents.findIndex(each => each.equalMatch(accept));
      let jIndex = other.contents.findIndex(each => each.equalMatch(accept));
      if (iIndex !== jIndex) {
        if (iIndex === -1) {
          return 1;
        }
        if (jIndex === -1) {
          return -1;
        }
        return iIndex - jIndex;
      }
      iIndex = this.contents.findIndex(each => each.match(accept));
      jIndex = other.contents.findIndex(each => each.match(accept));
      if (iIndex !== jIndex) {
        if (iIndex === -1) {
          return 1;
        }
        if (jIndex === -1) {
          return -1;
        }
        return iIndex - jIndex;
      }
      const iObj = this.contents[iIndex];
      const jObj = other.contents[jIndex];
      const compare = iObj.compareTo(jObj);
      if (compare !== 0) {
        return compare;
      }
    }
    return 0;
  }

  protected parseAccepts(accepts: string): string[] {
    const nameMapPri: Map<string, number> = new Map();
    accepts.split(',').forEach(accept => {
      accept = accept.trim().toLowerCase();
      let weight = 1;
      accept = accept.replace(/;q=(.*)$/, (_match, matchedWeight) => {
        weight = Number(matchedWeight);
        return '';
      });
      const [type, sub] = accept.split('/');
      const target = [];
      if (type && sub) {
        if (sub.includes('+')) {
          sub.split('+').forEach(e => {
            target.push(`${type}/${e}`);
          });
        } else {
          target.push(accept);
        }
      }
      target.forEach(each => {
        nameMapPri.set(each, weight);
      });
    });
    const sorted = [...nameMapPri.entries()];
    sorted.sort((a, b) => b[1] - a[1]);
    return sorted.map(each => each[0]);
  }
}
