import { IncomingMessage } from 'http';

export default abstract class RequestCondition<Content> {
  private contents: Content[];
  constructor(contents: Content[]) {
    this.contents = contents;
  }
  abstract getMatchingCondition(
    req: IncomingMessage,
  ): null | RequestCondition<Content>;
  abstract getContent(): any;
  abstract isEmpty(): boolean;
  abstract compareTo(
    a: RequestCondition<Content>,
    b: RequestCondition<Content>,
  ): number;
  abstract combine(
    parser: RequestCondition<Content>,
  ): RequestCondition<Content>;
}
