import * as fs from 'better-fs';
import * as cheerio from 'cheerio';
import * as lz from 'lz-string';
import { MangaDownloader, MangaUnitReturn } from './manga';

export class Maofly extends MangaDownloader {
  async search(): Promise<string> {
    return '';
  }

  protected async collectMangaUnit(): Promise<MangaUnitReturn> {
    const html = await this.fetchDirs(this.mangaEntryUrl);
    const $ = cheerio.load(html);

    const result: MangaUnitReturn = {
      volumes: [],
      chapters: [],
    };

    const handle = (tab: any, type: 'volumes' | 'chapters') => {
      $('.fixed-a-es', tab).each((__i, anchor) => {
        const url = $(anchor).attr('href');
        if (!url) {
          throw new Error($(anchor).text() + ' 解析href失败');
        }
        result[type].unshift(url);
      });
    };
    const isOver = $('.comic-pub-state').text() === '已完结';

    $('#comic-book-list .tab-pane').each((_i, tab) => {
      const header = $('h2', tab);
      if (header) {
        if (header.text() === '单行本') {
          handle(tab, 'volumes');
        }
        if (header.text() === '单话') {
          handle(tab, 'chapters');
        }
      }
    });
    result.isOver = isOver;

    const src = $('.comic-cover img').attr('src');
    if (src) {
      fs.writeFileSync(this.coverLocate, await this.fetchImgs(src));
    }

    return result;
  }

  protected fetchDirs(url: string): Promise<Buffer> {
    return this.fetch(url, {
      header: {
        referer: 'https://www.maofly.com',
      },
    });
  }

  public fetchImgs(url: string): Promise<Buffer> {
    const u = new URL(url);
    const referer = `${u.protocol}//${u.host}`;

    return this.fetch(url, {
      header: {
        referer,
      },
    });
  }

  protected async collectImgUrls(volumePageUrl: string): Promise<string[]> {
    const volumePageHtml = String(await this.fetchDirs(volumePageUrl));
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
