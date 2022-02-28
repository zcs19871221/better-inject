import Reader from './reader';
import { Resource } from '../../';

@Resource()
export default class FileReader implements Reader {
  read() {
    return 'file Reader';
  }
}
