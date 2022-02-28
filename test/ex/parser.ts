import Reader from './reader';
import { Resource, Inject } from '../..';

@Resource()
export default class Parser {
  private reader: Reader;
  constructor(@Inject('filereader') reader: Reader) {
    this.reader = reader;
  }

  parse() {
    return 'invoke reader:' + this.reader.read();
  }
}
