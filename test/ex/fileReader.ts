import Reader from './reader';
import { Resource } from '../../context';

@Resource()
export default class FileReader implements Reader {
  read() {
    return 'file Reader';
  }
}
