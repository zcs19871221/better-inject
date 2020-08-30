import { IncomingMessage } from 'http';
import RequestCondition from './request_condition';

export default abstract class RequestKeyValueCondition extends RequestCondition<
  string
> {
  constructor(params: string[] | string) {
    if (typeof params === 'string') {
      params = params.split(';');
    }
    super(params);
  }

  private match(expression: string, obj: { [name: string]: any }) {
    const [key, value] = expression.split('=');
    let isNegative = false;
    if (key.startsWith('!')) {
      isNegative = true;
    }
    let res: boolean;
    if (value) {
      res = obj[key] === value;
    } else {
      res = obj[key] !== undefined;
    }
    return isNegative ? !res : res;
  }

  private getValidCount() {
    let validCount = 0;
    this.contents.forEach(expression => {
      const [key, value] = expression.split('=');
      if (value !== undefined && !key.startsWith('!')) {
        validCount++;
      }
    });
    return validCount;
  }

  protected doGetMatchingCondition(req: IncomingMessage) {
    const obj = this.extracObject(req);
    const matched = this.contents.every(expression =>
      this.match(expression, obj),
    );
    if (matched) {
      return this.contents;
    }
    return [];
  }

  protected abstract extracObject(
    req: IncomingMessage,
  ): { [name: string]: any };

  protected doCombine(other: RequestKeyValueCondition) {
    return this.contents.concat(other.contents);
  }

  protected doCompareTo(other: RequestKeyValueCondition) {
    const compare = other.contents.length - this.contents.length;
    if (compare !== 0) {
      return compare;
    }
    return other.getValidCount() - this.getValidCount();
  }
}
