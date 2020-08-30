import { IncomingMessage } from 'http';

export default abstract class RequestCondition<Content> {
  protected contents: Content[];
  constructor(contents: Content[]) {
    this.contents = contents;
  }

  getContent() {
    return this.contents;
  }

  getMatchingCondition(req: IncomingMessage): null | RequestCondition<Content> {
    if (this.isEmpty()) {
      return this;
    }
    const matched = this.doGetMatchingCondition(req);
    if (!matched || matched.length === 0) {
      return null;
    }
    return Reflect.construct(this.constructor, matched);
  }

  isEmpty(): boolean {
    return this.contents.length === 0;
  }

  compareTo(other: RequestCondition<Content>): number {
    if (this.isEmpty() && !other.isEmpty()) {
      return 1;
    }
    if (!this.isEmpty() && other.isEmpty()) {
      return -1;
    }
    if (this.isEmpty() && other.isEmpty()) {
      return 0;
    }
    return this.doCompareTo(other);
  }

  combine(other: RequestCondition<Content>): RequestCondition<Content> {
    if (other.isEmpty()) {
      return this;
    }
    if (this.isEmpty()) {
      return other;
    }
    return Reflect.construct(this.constructor, this.doCombine(other));
  }

  protected abstract doGetMatchingCondition(req: IncomingMessage): Content[];
  protected abstract doCombine(other: RequestCondition<Content>): Content[];
  protected abstract doCompareTo(other: RequestCondition<Content>): number;
}
