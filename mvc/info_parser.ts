import { IncomingMessage } from 'http';

interface InfoParser {
  getMatchingCondition(req: IncomingMessage): InfoParser | null;
  merge(parser: InfoParser): InfoParser;
  getKey(): string;
}
export { InfoParser };
export default abstract class AbstractInfoParser implements InfoParser {
  protected condition: string[] = [];
  protected isEmpty: boolean = false;
  constructor(input: string[] | undefined) {
    if (!input) {
      this.condition = [];
    } else {
      input = [...new Set(input)];
      input.sort();
      this.condition = input;
    }
  }

  getCondition() {
    return this.condition;
  }

  abstract getJoinLogic(): '&&' | '||';
  getKey() {
    return this.condition.join(this.getJoinLogic());
  }

  getMatchingCondition(req: IncomingMessage): InfoParser | null {
    if (this.condition.length === 0) {
      return this;
    }
    const matchedCondition = this.filterCondition(req);
    if (matchedCondition.length == 0) {
      return null;
    }
    return this.createEntity(matchedCondition);
  }

  abstract filterCondition(req: IncomingMessage): string[];
  abstract createEntity(matchedCondition: string[]): InfoParser;
  merge(parser: AbstractInfoParser): InfoParser {
    return this.createEntity(this.condition.concat(parser.getCondition()));
  }
}
