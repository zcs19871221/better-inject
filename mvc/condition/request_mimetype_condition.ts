import { IncomingMessage } from 'http';
import RequestCondition from './request_condition';

export class MimeTypeParser {
  private expression!: string;
  private type!: string;
  private subType!: string;
  private isWholeWildcard: boolean = false;
  private isTypeWildcard: boolean = false;
  private isSubTypeWildcard: boolean = false;
  constructor(expression: string) {
    this.expression = expression;
    this.parse(expression);
  }

  private parse(expression: string) {
    const [type, subType] = expression
      .split('/')
      .map(each => each.trim().toLowerCase());
    if (!type || !subType || (type === '*' && subType !== '*')) {
      throw new Error('mimeType表达式应该为:type/subType 或 */* 或 type/* ');
    }
    this.type = type;
    this.subType = subType;
    if (this.type === '*' && this.subType === '*') {
      this.isWholeWildcard = true;
      this.isTypeWildcard = true;
      this.isSubTypeWildcard = true;
    } else if (this.subType === '*') {
      this.isSubTypeWildcard = true;
    }
  }

  hashCode() {
    return this.expression;
  }

  private score() {
    if (this.isWholeWildcard) {
      return 3;
    }
    if (this.isTypeWildcard) {
      return 2;
    }
    return 1;
  }

  equalMatch(mime: string) {
    return this.expression === mime;
  }
  match(mime: string) {
    if (this.isWholeWildcard) {
      return true;
    }
    const [type, subType] = mime.split('/');
    if (this.isTypeWildcard) {
      return this.subType === subType;
    }
    if (this.isSubTypeWildcard) {
      return this.type === type;
    }
    return this.type === type && this.subType === subType;
  }

  compareTo(other: MimeTypeParser) {
    return this.score() - other.score();
  }
}
export default abstract class RequestMimeTypeCondition<
  T extends RequestMimeTypeCondition<T>
> extends RequestCondition<MimeTypeParser, T> {
  constructor(accpets: (string | MimeTypeParser)[]) {
    const expressions = [...new Set(accpets)].map(accept =>
      typeof accept === 'string' ? new MimeTypeParser(accept) : accept,
    );
    expressions.sort((a, b) => a.compareTo(b));
    super(expressions);
  }

  abstract doGetMatchingCondition(req: IncomingMessage): MimeTypeParser[];

  doCombine(other: T) {
    return other;
  }

  abstract doCompareTo(other: T, req: IncomingMessage): number;
}
