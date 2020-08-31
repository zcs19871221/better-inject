import { IncomingMessage } from 'http';

interface RequestCondition {
  getMatchingCondition(req: IncomingMessage): null | RequestCondition | this;
  compareTo(other: RequestCondition, req?: IncomingMessage): number;
  combine(other: RequestCondition): RequestCondition | this;
  isEmpty(): boolean;
  hashCode(): string;
}
export { RequestCondition };
export default abstract class AbstractRequestCondition<Content>
  implements RequestCondition {
  protected contents: Content[];
  constructor(contents: Content[]) {
    this.contents = contents;
  }

  getContent() {
    return this.contents;
  }

  getMatchingCondition(req: IncomingMessage): null | RequestCondition | this {
    if (this.isEmpty()) {
      return this;
    }
    const matched = this.doGetMatchingCondition(req);
    if (!matched || matched.length === 0) {
      return null;
    }
    return Reflect.construct(this.constructor, [matched]);
  }

  isEmpty(): boolean {
    return this.contents.length === 0;
  }

  compareTo(other: RequestCondition, req?: IncomingMessage): number {
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

  combine(other: RequestCondition): RequestCondition | this {
    if (other.isEmpty()) {
      return this;
    }
    if (this.isEmpty()) {
      return other;
    }
    const combined = this.doCombine(other);
    if (Array.isArray(combined)) {
      return Reflect.construct(this.constructor, []);
    }
    return combined;
  }

  hashCode(): string {
    if (this.isEmpty()) {
      return '';
    }
    return this.createhashCode();
  }

  protected abstract createhashCode(): string;
  protected abstract doGetMatchingCondition(req: IncomingMessage): Content[];
  protected abstract doCombine(
    other: RequestCondition,
  ): Content[] | RequestCondition;
  protected abstract doCompareTo(
    other: RequestCondition,
    req?: IncomingMessage,
  ): number;
}
