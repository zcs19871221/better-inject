import Reader from './reader';
import { Resource, Inject } from '../../context';

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
