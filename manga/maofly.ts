import path from 'path';
import * as cheerio from 'cheerio';
import * as lz from 'lz-string';
import { Manga, VolumeInfo } from './manga';

interface Item {
  isConsecutively: boolean;
  links: {
    name: string;
    href: string;
    seq: number;
  }[];
  totalChapter: number;
  breakPoint: string;
}
export class Maofly extends Manga {
  constructor(maxThread: number = 800, loglevel: 'debug' | 'log' = 'debug') {
    super('https://www.maofly.com', maxThread, loglevel);
  }

  async search(): Promise<string> {
    return '';
  }

  protected async collectMangaCover(name: string, url: string) {
    const html = await this.get(url);
    const $ = cheerio.load(html);
    const src = $('.comic-cover img').attr('src');
    if (src === undefined) {
      console.error('没找到封面 ' + name);
      return '';
    }
    const cover = path.join(
      Manga.imgBaseDir,
      name,
      `cover.${Manga.extractSuffixFromUrl(src)}`,
    );
    await this.fetchThenSaveImg(src, cover);
    return `cover.${Manga.extractSuffixFromUrl(src)}`;
  }

  protected async getVolumesInfo(mangaPageUrl: string): Promise<VolumeInfo[]> {
    const html = await this.get(mangaPageUrl);
    const $ = cheerio.load(html);

    const chapter: Item = {
      isConsecutively: false,
      links: [],
      totalChapter: 0,
      breakPoint: '',
    };
    const book: Item = {
      isConsecutively: false,
      links: [],
      totalChapter: 0,
      breakPoint: '',
    };
    const extra: { url: string; name: string }[] = [];

    $('#comic-book-list .fixed-a-es').each((_i, anchor) => {
      const name = $(anchor).text();
      const href = $(anchor).attr('href') || '';
      if (!href || !name || !href.startsWith(this.root)) {
        throw new Error(`${mangaPageUrl} 第 ${_i} 个anchor 获取href text失败`);
      }

      const matched = name.match(/第(\d+)([回卷话])/);
      if (!matched || !matched[1] || !matched[2]) {
        extra.push({ url: href, name });
        this.log(`检查番外 ${name}`);
        return;
      }

      const seq = Number(matched[1]);
      const link = { name, href, seq };

      if (['回', '话'].includes(matched[2])) {
        chapter.links.push(link);
        chapter.totalChapter += 1;
      } else {
        book.links.push(link);
        book.totalChapter += 9;
      }
    });

    const handle = (item: Item) => {
      item.links.sort((a, b) => a.seq - b.seq);
      let breakPoint: string = '';
      item.isConsecutively = item.links.every((e, i) => {
        if (e.seq !== i + 1) {
          breakPoint = e.name;
        }
        return e.seq === i + 1;
      });
      item.breakPoint = breakPoint;
    };
    handle(chapter);
    handle(book);

    let links: Item['links'] = [];
    if (chapter.totalChapter === 0 || book.totalChapter === 0) {
      links = (chapter.totalChapter === 0 ? book : chapter).links;
    } else if (chapter.isConsecutively && book.isConsecutively) {
      links = (chapter.totalChapter + 30 < book.totalChapter ? book : chapter)
        .links;
    } else if (book.isConsecutively) {
      const breakPoint = chapter.links.findIndex((e, i) => e.seq !== i + 1);
      if (breakPoint === -1) {
        throw new Error('未找到chapter断点');
      }
      links = [...book.links, ...chapter.links.slice(breakPoint)];
    }

    if (links.length === 0) {
      throw new Error(`${mangaPageUrl} 单行本和话解析错误`);
    }

    return links.map(e => ({ url: e.href, name: e.name })).concat(extra);
  }

  protected async getVolumeImg(volumePageUrl: string): Promise<string[]> {
    const volumePageHtml = await this.get(volumePageUrl);
    const $ = cheerio.load(volumePageHtml);

    const encodedImgUrls =
      volumePageHtml.match(/img_data = "([^"]+)"/)?.[1] || '';
    const imgUrls = lz.decompressFromBase64(encodedImgUrls);

    if (!imgUrls) {
      throw new Error('图片base64Urls获取失败 ' + encodedImgUrls);
    }

    const domain = $('div .vg-r-data').attr('data-chapter-domain');
    return imgUrls.split(',').map(img => `${domain}/uploads/${img}`);
  }
}
