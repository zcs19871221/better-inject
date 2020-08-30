import { IncomingMessage } from 'http';
import InfoParser from './request_condition';
import PathParser from './request_url_condition';

type ValueCondition = ['exists' | 'notExists'] | ['equal', string];

abstract class KeyParser extends InfoParser {
  filterCondition(req: IncomingMessage) {
    const obj = this.extractObj(req);
    return this.condition.filter(cond => {
      const [key, value] = cond.split('=');
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
    });
  }

  abstract extractObj(
    req: IncomingMessage,
  ): { [key: string]: string | undefined };
  abstract createEntity(condition: string[]): InfoParser;
}
class HeaderParser extends KeyParser {
  // set-cookie is always an array. Duplicates are added to the array.
  // For duplicate cookie headers, the values are joined together with '; '.
  // For all other headers, the values are joined together with ', '.
  //   https://nodejs.org/api/http.html#http_message_headers
  extractObj(req: IncomingMessage) {
    const target: { [key: string]: string | undefined } = {};
    Object.entries(req.headers).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value = value.join('');
      }
      target[key] = value;
    });
    return target;
  }

  createEntity(condition: string[]) {
    return new HeaderParser(condition);
  }
}
class ParamParser extends KeyParser {
  constructor(input: string[]) {
    super(input);
  }

  extractObj(req: IncomingMessage) {
    const pathParser = new PathParser([<string>req.url]);
    return pathParser.getPathVariable(req);
  }

  createEntity(condition: string[]) {
    return new ParamParser(condition);
  }
}

export { ParamParser, HeaderParser };
