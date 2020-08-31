import { IncomingMessage } from 'http';
import RequestCondition from './request_condition';

export default abstract class RequestKeyValueCondition<
  T extends RequestKeyValueCondition<T>
> extends RequestCondition<string, T> {
  constructor(params: string[] | string) {
    if (typeof params === 'string') {
      params = params.split(';');
    }
    super(params);
  }

  private match(expression: string, req: IncomingMessage) {
    const [key, value] = expression.split('=');
    let isNegative = false;
    if (key.startsWith('!')) {
      isNegative = true;
    }
    let isMatched: boolean;
    const reqValue = this.getValue(key, req);
    if (value) {
      if (reqValue === undefined) {
        isMatched = false;
      } else if (typeof reqValue === 'string') {
        isMatched = reqValue === value;
      } else {
        isMatched = reqValue.includes(value);
      }
    } else {
      isMatched = reqValue !== undefined;
    }
    return isNegative ? !isMatched : isMatched;
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
    const matched = this.contents.every(expression =>
      this.match(expression, req),
    );
    if (matched) {
      return this.contents;
    }
    return [];
  }

  protected abstract getValue(
    key: string,
    req: IncomingMessage,
  ): string | string[] | undefined;

  protected doCombine(other: T) {
    return this.contents.concat(other.contents);
  }

  protected doCompareTo(other: T) {
    const compare = other.contents.length - this.contents.length;
    if (compare !== 0) {
      return compare;
    }
    return other.getValidCount() - this.getValidCount();
  }
}
