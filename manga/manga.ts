import path from 'path';
import * as fs from 'better-fs';
import { Tool } from './tool';

export interface VolumeInfo {
  name: string;
  url: string;
}
export interface Volume extends VolumeInfo {
  imgs: [string, boolean][];
}

export interface VolumeSuffix {
  main: string;
  other: {
    suffix: string;
    seqs: number[];
  }[];
}

export interface MangaPreview {
  name: string;
  cover: string;
  readed?: boolean;
  isCollect?: boolean;
  volumes: [string, number, VolumeSuffix][];
}

export interface ReadPoint {
  mangaName: string;
  volumeName: string;
  pageSeq: number;
}

export abstract class Manga extends Tool {
  static imgBaseDir: string = 'G:/漫画';
  static mangasJson: string = path.join(Manga.imgBaseDir, '.mangas.json');
  static readPointName: string = '.readpoint.json';

  constructor(
    protected readonly root: string,
    maxThread: number = 20,
    logLevel: 'debug' | 'log' = 'debug',
    private readonly interval: number = 0,
    private readonly downloadType: 'pipe' | 'buf' = 'pipe',
  ) {
    super(root, maxThread, logLevel);
  }

  public abstract search(): Promise<string>;

  public async download(mangaName: string, mangaPageUrl: string) {
    const { downloadingJson, mangaDir } = this.prepare(mangaName);
    let volumes: Volume[] = [];
    let isFinish = true;
    const recordDownloaded = () => {
      if (volumes.length > 0) {
        fs.writeFileSync(downloadingJson, JSON.stringify(volumes, null, 2));
      }
    };
    try {
      [volumes, isFinish] = await this.collectVolumes(
        downloadingJson,
        mangaName,
        mangaPageUrl,
      );

      process.on('SIGINT', () => {
        recordDownloaded();
        this.log('已记录下载进度');
        process.exit();
      });
      const mangaImgUrls = this.filterWillDownloadImgs(volumes, mangaDir);
      const hasFail = await this.downloadImgs(
        mangaImgUrls,
        mangaDir,
        volumes,
        recordDownloaded,
      );

      if (!hasFail) {
        const cover = await this.collectMangaCover(
          mangaName,
          mangaPageUrl,
          mangaImgUrls[0].locate,
        );
        this.updateMangaJson(mangaName, cover, volumes);
        if (isFinish) {
          fs.removeSync(downloadingJson);
          this.debug(`删除下载记录 ${downloadingJson}`);
        }
        this.log(`成功下载 ${mangaName}`);
      } else {
        this.log('有下载失败图片！再次执行以补完未成功图片!');
      }
    } catch (error) {
      recordDownloaded();
      console.error((error as Error).message);
    }
  }

  protected abstract collectMangaCover(
    name: string,
    url: string,
    firstPic: string,
  ): Promise<string>;

  private updateMangaJson(mangaName: string, cover: string, volumes: Volume[]) {
    this.debug(`写入 ${mangaName} 记录到 ${Manga.mangasJson}`);
    let mangaJson: MangaPreview[] = [];
    if (fs.existsSync(Manga.mangasJson)) {
      mangaJson = JSON.parse(
        fs.readFileSync(Manga.mangasJson, 'utf-8'),
      ) as MangaPreview[];
      this.log(`创建 ${Manga.mangasJson}`);
    } else {
      this.log(`更新 ${Manga.mangasJson}`);
    }
    const mangaPreview: MangaPreview = {
      name: mangaName,
      cover,
      readed: false,
      volumes: volumes.map(e => {
        const map: { [suffix: string]: number[] } = {};
        let biggestNum = -Infinity;
        let biggest = '';
        e.imgs.forEach((e, imgIndex) => {
          const suffix = Manga.extractSuffixFromUrl(e[0]);
          map[suffix] = map[suffix] || [];
          map[suffix].push(imgIndex + 1);
          if (biggestNum < map[suffix].length) {
            biggestNum = map[suffix].length;
            biggest = suffix;
          }
        });
        const other = Object.entries(map)
          .filter(e => e[0] !== biggest)
          .map(e => ({
            suffix: e[0],
            seqs: e[1],
          }));
        const suffix: VolumeSuffix = {
          main: biggest,
          other,
        };
        return [e.name, e.imgs.length, suffix];
      }),
    };
    const oldIndex = mangaJson.findIndex(e => e.name === mangaName);
    if (oldIndex > -1) {
      mangaJson[oldIndex] = mangaPreview;
    } else {
      mangaJson.push(mangaPreview);
    }
    fs.writeFileSync(Manga.mangasJson, JSON.stringify(mangaJson, null, 2));
  }

  private async collectVolumes(
    downloadingJson: string,
    mangaName: string,
    mangaPageUrl: string,
  ): Promise<[Volume[], boolean]> {
    let volumes: Volume[] = [];
    if (fs.existsSync(downloadingJson)) {
      this.debug(`存在 ${mangaName} 图片地址, 读取 ${downloadingJson}`);
      volumes = JSON.parse(
        fs.readFileSync(downloadingJson, 'utf-8'),
      ) as Volume[];
    }

    this.debug(`解析 ${mangaName} 网址及名称,开始解析..`);
    let [volumesInfo, isFinish] = await this.getVolumesInfo(
      mangaPageUrl,
      mangaName,
    );
    volumesInfo = volumesInfo.filter(
      e => !volumes.find(ee => ee.url === e.url),
    );

    this.debug(`解析完 ${mangaName}  网址及名称`);

    if (volumesInfo.length > 0) {
      this.debug(`下载 ${mangaName} 图片地址`);
      const increasedVolumes = await this.getVolumesImgUrls(
        mangaName,
        volumesInfo,
      );
      volumes.push(...increasedVolumes);
    }
    fs.writeFileSync(downloadingJson, JSON.stringify(volumes, null, 2));
    this.debug(`图片地址信息保存至 ${downloadingJson}`);

    return [volumes, isFinish];
  }

  static extractSuffixFromUrl(url: string) {
    return url.match(/\.([^.?#]*)($|\?|#)/)?.[1] || 'jpg';
  }

  private prepare(mangaName: string) {
    this.log(`开始下载 ${mangaName} `);
    const mangaDir = path.join(Manga.imgBaseDir, mangaName);
    fs.ensureMkdirSync(mangaDir);
    const downloadingJson = path.join(mangaDir, '.dowloding.json');
    return { downloadingJson, mangaDir };
  }

  private filterWillDownloadImgs(volumes: Volume[], mangaDir: string) {
    const mangaImgs = volumes.reduce(
      (acc: { url: string; locate: string }[], cur) => {
        const imgDir = path.join(mangaDir, cur.name);

        if (!fs.existsSync(imgDir)) {
          fs.mkdirSync(imgDir);
        }
        acc.push(
          ...cur.imgs
            .map(([url, isDownloaded], index) => {
              const suffix = Manga.extractSuffixFromUrl(url);
              const locate = path.join(
                imgDir,
                `${String(index + 1).padStart(3, '0')}.${suffix}`,
              );
              return {
                url,
                locate,
                isDownloaded,
              };
            })
            .filter(e => e.isDownloaded === false),
        );
        return acc;
      },
      [],
    );
    return mangaImgs;
  }

  protected abstract getVolumesInfo(
    mangaPageUrl: string,
    mangaName: string,
  ): Promise<[VolumeInfo[], boolean]>;

  private async downloadImgs(
    imgs: { url: string; locate: string }[],
    mangaDir: string,
    volumes: Volume[],
    recordDownloaded: () => void,
  ): Promise<boolean> {
    // let downloaded = 0;
    const flagDownloaded = (url: string) => {
      for (const volume of volumes) {
        const downloadedImg = volume.imgs.find(e => e[0] === url);
        if (downloadedImg) {
          downloadedImg[1] = true;
          // downloaded++;
          // if (downloaded % 50 === 0 || ) {
          recordDownloaded();
          // }
        }
      }
    };
    const { fail } = await this.runParallel({
      interval: this.interval,
      points: Array.from({ length: 9 }, (_a, _i) => (_i + 1) * 10),
      tasks: imgs.map(({ url, locate }) => async (): Promise<void> => {
        try {
          await this.fetchThenSaveImg(url, locate, this.downloadType);
          flagDownloaded(url);
          return;
        } catch (err) {
          if (err instanceof Error) {
            err.message =
              `下载 ${mangaDir} - ${locate} - ${url} 失败` + err.message;
          }
          throw err;
        }
      }),
      msg: `下载 ${mangaDir}`,
    });
    return fail > 0;
  }

  protected async getVolumesImgUrls(
    mangaName: string,
    volumesInfo: VolumeInfo[],
  ): Promise<Volume[]> {
    return (
      await this.runParallel({
        msg: `${mangaName} 图片地址解析`,
        stopWhenError: true,
        tasks: volumesInfo.map(e => {
          return async () => {
            const imgs = await this.getVolumeImg(e.url);
            const t: [string, boolean][] = imgs.map(url => [url, false]);
            return {
              ...e,
              imgs: t,
            };
          };
        }),
      })
    ).result;
  }

  protected abstract getVolumeImg(volumePageUrl: string): Promise<string[]>;
}
