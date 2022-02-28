import path from 'path';
import * as cheerio from 'cheerio';
// import * as lz from 'lz-string';
import * as iconv from 'iconv-lite';
import { Manga, VolumeInfo } from './manga';
import * as helper from './laimanhua-decode';

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
export class Laimanhua extends Manga {
  constructor(maxThread: number = 800, loglevel: 'debug' | 'log' = 'debug') {
    super('https://www.laimanhua.net/', maxThread, loglevel, 0, 'buf');
  }

  async search(): Promise<string> {
    return '';
  }

  protected async collectMangaCover(name: string, url: string) {
    const html = await this.get(url);
    const $ = cheerio.load(html);
    const src = $('.cover img').attr('src');
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
    let html = await this.get(mangaPageUrl, {}, []);
    html = iconv.decode(html, 'GBK');
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

    $('.plist a').each((_i, anchor) => {
      const name = $(anchor).text();
      let href = $(anchor).attr('href') || '';
      if (!href || !name) {
        throw new Error(`${mangaPageUrl} 第 ${_i} 个anchor 获取href text失败`);
      }
      if (href.startsWith('/')) {
        href = (this.root + href).replace(/\/+/, '/');
      }
      if (name.includes('第7部') && !name.includes('01')) {
        const matched = name.match(/第7部(\d+)卷/);
        if (matched && matched[1]) {
          book.links.push({
            href,
            name: matched[1].padStart(2, '0'),
            seq: Number(matched[1]),
          });
          book.totalChapter += 9;
        }
      }
      return;
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
    const chapterId = volumePageHtml.match(/var currentChapterid = '([^']+)'/);
    const picTree = volumePageHtml.match(/var picTree ='([^']+)'/);
    if (chapterId && chapterId[1] && picTree && picTree[1]) {
      helper.setParams(picTree[1], chapterId[1]);
      const pics = helper.getPics();
      return pics;
    }
    throw new Error(
      '图片地址获取失败,检查laimanhua-decode.ts以及html中的参数picTree和currentChapterid ',
    );
  }
}
