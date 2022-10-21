import path from 'path';
import Https from 'https';
import Http from 'http';
import os from 'os';
import * as fs from 'better-fs';
import sizeOf from 'image-size';
import _ from 'lodash';
import Request from 'better-request';

type MangaPage =
  | {
      imgUrl: string;
    }
  | {
      imgUrl?: undefined;
      width: number;
      height: number;
      suffix: string;
    };
type Unit =
  | {
      entryUrl: string;
    }
  | {
      entryUrl?: undefined;
      pages: MangaPage[];
    };

export interface Manga {
  name: string;
  volumes: Unit[];
  chapters: Unit[];
  lastUpdate: number;
  isOver: boolean;
  fetchedAll: boolean;
  hasBeenCollected: boolean;
  hasBeenRead: boolean;
  cover: {
    width: number;
    height: number;
  };
}

export interface ReadPoint {
  mangaName: string;
  volumes: { index: number; ratio: number };
  chapters: { index: number; ratio: number };
}

export interface MangaUnitReturn {
  volumes: string[];
  chapters: string[];
  isOver?: boolean;
}

export abstract class MangaDownloader {
  static imgBaseDir: string = path.join(os.homedir(), 'manga');

  static readPointName: string = '.readpoint.json';
  static record: string = '.manga.json';

  static getRecord(mangaName: string): Manga {
    return JSON.parse(
      fs.readFileSync(
        path.join(
          MangaDownloader.imgBaseDir,
          mangaName,
          MangaDownloader.record,
        ),
        'utf-8',
      ),
    );
  }

  static getAllRecord(): Manga[] {
    return fs
      .readdirSync(path.join(MangaDownloader.imgBaseDir))
      .filter(x => !x.startsWith('.'))
      .map(name => {
        return MangaDownloader.getRecord(name);
      });
  }

  static writeRecord(mangaName: string, record: Manga) {
    return fs.writeFileSync(
      path.join(MangaDownloader.imgBaseDir, mangaName, MangaDownloader.record),
      JSON.stringify(record),
    );
  }

  protected dir: string;
  protected name: string;
  private recordLocate: string;
  protected record: Manga;
  protected mangaEntryUrl: string;
  private isDebug: boolean;
  protected coverLocate: string;

  private types = ['volumes', 'chapters'] as const;

  constructor({
    name,
    mangaEntryUrl,
    isOver = false,
    isDebug = true,
  }: {
    name: string;
    mangaEntryUrl: string;
    isOver?: boolean;
    isDebug?: boolean;
  }) {
    this.dir = path.join(MangaDownloader.imgBaseDir, name);
    if (!fs.existsSync(this.dir)) {
      fs.mkdirSync(this.dir);
    }
    this.types.forEach(type => {
      const dir = path.join(this.dir, type);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
      }
    });

    this.recordLocate = path.join(this.dir, MangaDownloader.record);
    if (fs.existsSync(this.recordLocate)) {
      this.record = JSON.parse(fs.readFileSync(this.recordLocate, 'utf-8'));
    } else {
      this.record = {
        lastUpdate: Date.now(),
        volumes: [],
        chapters: [],
        name,
        isOver,
        fetchedAll: false,
        hasBeenCollected: false,
        hasBeenRead: false,
        cover: {
          width: 0,
          height: 0,
        },
      };
      this.save();
    }
    this.mangaEntryUrl = mangaEntryUrl;
    this.isDebug = isDebug;
    this.name = name;
    this.coverLocate = path.join(this.dir, 'cover.jpg');
  }

  public async download() {
    try {
      this.log('开始下载：' + this.name);
      if (this.record.fetchedAll && this.record.isOver) {
        this.debug('无需更新退出');
        return;
      }

      if (
        (this.record.volumes.length === 0 &&
          this.record.chapters.length === 0) ||
        (this.record.isOver === false &&
          Date.now() - this.record.lastUpdate >= 7 * 24 * 60 * 60 * 1000)
      ) {
        this.debug('获取单行本和章回信息');
        const mangaUnits = await this.collectMangaUnit();
        this.types.forEach(type => {
          mangaUnits[type].forEach((entryUrl, index) => {
            if (this.record[type][index] === undefined) {
              this.record[type][index] = {
                entryUrl,
              };
            }
          });
        });
        this.save();
        this.debug('保存单行本和章回信息');
      }

      await this.update('chapters');
      await this.update('volumes');
      this.record.fetchedAll = true;
      if (!fs.existsSync(this.coverLocate)) {
        const locate = this.types
          .map(e => path.join(this.dir, e, '1.jpg'))
          .find(e => fs.existsSync(e));
        if (locate) {
          fs.copyFileSync(locate, this.coverLocate);
        }
      }
      this.save();
    } catch (error) {
      console.error(error);
    }
  }

  protected save() {
    this.record.lastUpdate = Date.now();
    fs.writeFileSync(this.recordLocate, JSON.stringify(this.record));
  }

  private async update(type: 'volumes' | 'chapters') {
    let pageSeq = 0;
    for (let index = 0, len = this.record[type].length; index < len; index++) {
      let volume = this.record[type][index];
      if (volume.entryUrl !== undefined) {
        this.debug(
          type === 'volumes' ? '获取单行本图片地址' : '获取章回图片地址',
        );
        const imgs = await this.collectImgUrls(volume.entryUrl);
        this.debug('图片地址获取成功');
        const pages: MangaPage[] = imgs.map(url => ({
          imgUrl: url,
        }));
        this.record[type][index] = { pages };
        this.save();
      }
      volume = this.record[type][index];
      if (volume.entryUrl === undefined) {
        this.debug(
          '开始下载第' +
            (index + 1) +
            (type === 'chapters' ? '章回' : '单行本') +
            `全部 【${volume.pages.length}】 张图片`,
        );

        const originPages = volume.pages;
        await Promise.all(
          volume.pages.map((page, i) => {
            pageSeq += 1;
            if (page.imgUrl !== undefined) {
              let index = pageSeq;
              return this.fetchImgs(page.imgUrl)
                .then(buf => {
                  const suffix = MangaDownloader.extractSuffixFromUrl(
                    page.imgUrl,
                  );
                  const { width, height } = sizeOf(buf);
                  fs.writeFileSync(
                    path.join(
                      this.dir,
                      type,
                      String(index).padStart(5, '0') + '.' + suffix,
                    ),
                    buf,
                  );
                  originPages[i] = {
                    width: width ?? 0,
                    height: height ?? 0,
                    suffix,
                  };
                  this.save();
                })
                .catch(_err => {
                  console.error(page.imgUrl);
                });
            }
          }),
        );

        this.debug(
          '第' +
            (index + 1) +
            (type === 'chapters' ? '章回' : '单行本') +
            `下载完成\n\n`,
        );

        this.save();
      }
    }
  }

  protected log(...msg: any[]) {
    console.log(...msg);
  }

  protected debug(...msg: any[]) {
    if (this.isDebug) {
      this.log(...msg);
    }
  }

  private httpsAgent = new Https.Agent({
    keepAlive: false,
    maxSockets: 100,
  });
  private httpAgent = new Http.Agent({
    keepAlive: false,
    maxSockets: 100,
  });

  protected fetch(
    url: string,
    props: Omit<Parameters<typeof Request.fetch>[0], 'method' | 'url'> = {},
  ): Promise<Buffer> {
    const header = props.header;
    delete props.header;
    return Request.fetch(
      {
        url,
        agent: url.startsWith('https') ? this.httpsAgent : this.httpAgent,
        responseHandlers: props.responseHandlers ?? ['status', 'redirect'],
        header: {
          ...header,
          agent:
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.51 Safari/537.36',
        },
        method: 'GET',
        ...props,
      },
      null,
    );
  }

  protected fetchImgs(url: string): Promise<Buffer> {
    return this.fetch(url);
  }

  static extractSuffixFromUrl(url: string) {
    return url.match(/\.([^.?#]*)($|\?|#)/)?.[1] || 'jpg';
  }

  protected abstract collectMangaUnit(): Promise<MangaUnitReturn>;

  protected abstract collectImgUrls(unitEntryUrl: string): Promise<string[]>;
}
