import Reader from './reader';
import { Resource } from '../../context';

@Resource()
export default class Parser {
  private reader: Reader;
  constructor(reader: Reader) {
    this.reader = reader;
  }

  parse() {
    return 'invoke reader:' + this.reader.read();
  }
}
