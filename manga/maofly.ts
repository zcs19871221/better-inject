import path from 'path';
import * as cheerio from 'cheerio';
import * as lz from 'lz-string';
import { Manga, VolumeInfo } from './manga';

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

  protected async getVolumesInfo(
    mangaPageUrl: string,
    _mangaName: string,
  ): Promise<[VolumeInfo[], boolean]> {
    const html = await this.get(mangaPageUrl);
    const $ = cheerio.load(html);

    const volumeInfos: VolumeInfo[] = [];

    const handle = (tab: any) => {
      $('.fixed-a-es', tab).each((__i, anchor) => {
        const url = $(anchor).attr('href');
        const name = $(anchor).text();
        if (!url) {
          throw new Error($(anchor).text() + ' 解析href失败');
        }
        volumeInfos.unshift({
          url,
          name,
        });
      });
    };
    const isFinish = $('.comic-pub-state').text() === '已完结';

    $('#comic-book-list .tab-pane').each((_i, tab) => {
      const header = $('h2', tab);
      if (header) {
        if (header.text() === '单行本' && isFinish) {
          handle(tab);
        }
        if (header.text() === '单话' && !isFinish) {
          handle(tab);
        }
      }
    });
    return [volumeInfos, isFinish];
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
