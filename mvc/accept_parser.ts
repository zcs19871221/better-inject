import { ClientRequest } from 'http';
import InfoParser from './info_parser';

export default class AcceptParser implements InfoParser {
  private accpet: string;
  constructor(accpet: string) {
    this.accpet = accpet;
  }

  getAccept() {
    return this.accpet;
  }

  match(req: ClientRequest) {
    const mimeType = String(req.getHeader('content-type'));
    return mimeType
      .trim()
      .toLowerCase()
      .includes(this.accpet.trim().toLowerCase());
  }

  merge(accpet: AcceptParser) {
    return new AcceptParser(accpet.getAccept());
  }
}
