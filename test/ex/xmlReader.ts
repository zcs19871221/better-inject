import Reader from './reader';
import { Resource } from '../../context';

@Resource()
export default class XmlReader implements Reader {
  read() {
    return 'xml reader';
  }
}
