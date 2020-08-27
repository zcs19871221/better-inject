import { ClientRequest } from 'http';
import InfoParser from './info_parser';

export default class ContentTypeParser implements InfoParser {
  private contentTypes: string;
  private charSet: string;
  private mimeType: string;
  constructor(contentTypes: string) {
    this.contentTypes = contentTypes;
    const [mimeType, charSet] = this.parse(contentTypes);
    this.mimeType = mimeType;
    this.charSet = charSet;
  }

  private static CHARSET_KEY = 'charset=';
  private parse(contentTypes: string) {
    let mimeType = '';
    let charSet = '';
    contentTypes.split(';').forEach(each => {
      each = each.trim();
      const charsetIndex = each
        .toLowerCase()
        .indexOf(ContentTypeParser.CHARSET_KEY);
      if (charsetIndex > -1) {
        charSet = each.slice(
          charsetIndex,
          charsetIndex + ContentTypeParser.CHARSET_KEY.length,
        );
        return;
      }
      if (each.includes('/')) {
        mimeType = each;
      }
    });
    return [mimeType, charSet];
  }

  private getContentTypes() {
    return this.contentTypes;
  }

  getCharSet() {
    return this.charSet;
  }

  getMimeType() {
    return this.mimeType;
  }

  match(req: ClientRequest) {
    const [mimeType, charSet] = this.parse(
      String(req.getHeader('content-type')),
    );
    return this.mimeType === mimeType && this.charSet === charSet;
  }

  merge(contentType: ContentTypeParser) {
    return new ContentTypeParser(contentType.getContentTypes());
  }
}
