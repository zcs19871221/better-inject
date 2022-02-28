import { IncomingMessage } from 'http';
import RequestCondition from './request_condition';

export class MimeTypeParser {
  private expression!: string;
  private type!: string;
  private subType!: string;
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
    if (this.type === '*') {
      this.isTypeWildcard = true;
    }
    if (this.subType === '*') {
      this.isSubTypeWildcard = true;
    }
  }

  getContent() {
    return this.expression;
  }

  hashCode() {
    return this.expression;
  }

  private score() {
    if (this.isTypeWildcard && this.isSubTypeWildcard) {
      return 3;
    }
    if (this.isSubTypeWildcard) {
      return 2;
    }
    return 1;
  }

  equalMatch(mime: string) {
    return this.expression === mime;
  }

  match(mime: string) {
    const input = new MimeTypeParser(mime);
    if (
      (this.isTypeWildcard && this.isSubTypeWildcard) ||
      (input.isTypeWildcard && input.isSubTypeWildcard)
    ) {
      return true;
    }
    if (this.isSubTypeWildcard || input.isSubTypeWildcard) {
      return this.type === input.type;
    }
    return this.type === input.type && this.subType === input.subType;
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
