import Reader from './reader';
import { Resource } from '../../';

@Resource()
export default class XmlReader implements Reader {
  read() {
    return 'xml reader';
  }
}
