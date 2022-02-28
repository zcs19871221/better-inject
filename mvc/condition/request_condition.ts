import { IncomingMessage } from 'http';

interface RequestCondition<T> {
  getMatchingCondition(req: IncomingMessage): null | T | this;
  compareTo(other: T, req?: IncomingMessage): number;
  combine(other: T): T | this;
  isEmpty(): boolean;
  hashCode(): string;
}
export { RequestCondition };
export default abstract class AbstractRequestCondition<
  Content,
  T extends AbstractRequestCondition<Content, T>
> implements RequestCondition<T> {
  protected contents: Content[];
  constructor(contents: Content[]) {
    this.contents = contents;
  }

  getContent() {
    return this.contents;
  }

  getMatchingCondition(req: IncomingMessage): null | T | this {
    if (this.isEmpty()) {
      return this;
    }
    const matched = this.doGetMatchingCondition(req);
    if (!matched || matched.length === 0) {
      return null;
    }
    if (matched === this.contents) {
      return this;
    }
    return this.instance(matched);
  }

  isEmpty(): boolean {
    return this.contents.length === 0;
  }

  compareTo(other: T, req?: IncomingMessage): number {
    if (this.isEmpty() && !other.isEmpty()) {
      return 1;
    }
    if (!this.isEmpty() && other.isEmpty()) {
      return -1;
    }
    if (this.isEmpty() && other.isEmpty()) {
      return 0;
    }
    return this.doCompareTo(other, req);
  }

  combine(other: T): T | this {
    if (other.isEmpty()) {
      return this;
    }
    if (this.isEmpty()) {
      return other;
    }
    const combined = this.doCombine(other);
    if (Array.isArray(combined)) {
      return this.instance(combined);
    }
    return combined;
  }

  private instance(contents: Content[]): T {
    return Reflect.construct(this.constructor, [contents]);
  }

  hashCode(): string {
    if (this.isEmpty()) {
      return '';
    }
    return this.createhashCode();
  }

  protected abstract createhashCode(): string;
  protected abstract doGetMatchingCondition(req: IncomingMessage): Content[];
  protected abstract doCombine(other: T): Content[] | T;
  protected abstract doCompareTo(other: T, req?: IncomingMessage): number;
}
