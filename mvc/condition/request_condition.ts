import { IncomingMessage } from 'http';

interface RequestCondition {
  getMatchingCondition(req: IncomingMessage): null | RequestCondition;
  compareTo(other: RequestCondition, req?: IncomingMessage): number;
  combine(other: RequestCondition): RequestCondition;
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

  getMatchingCondition(
    req: IncomingMessage,
  ): null | AbstractRequestCondition<Content> {
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

  compareTo(
    other: AbstractRequestCondition<Content>,
    req?: IncomingMessage,
  ): number {
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

  combine(
    other: AbstractRequestCondition<Content>,
  ): AbstractRequestCondition<Content> {
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

  abstract doGetMatchingCondition(req: IncomingMessage): Content[];
  abstract doCombine(
    other: AbstractRequestCondition<Content>,
  ): Content[] | AbstractRequestCondition<Content>;
  abstract doCompareTo(
    other: AbstractRequestCondition<Content>,
    req?: IncomingMessage,
  ): number;
}
