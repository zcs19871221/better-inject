import {
  Controller,
  RequestMapping,
  ResponseBody,
  RequestParam,
  PathVariable,
  WebRequest,
  ResponseHeader,
  RequestBody,
  Method,
  // RequestHeader,
} from '..';

import path from 'path';
import * as fs from 'better-fs';

import { MangaDownloader, Manga, ReadPoint } from './manga';

@Controller
@RequestMapping()
export default class Mg {
  private staticBase: string = 'F:/watch-manga/build';

  @RequestMapping({
    path: '/mangas',
  })
  @ResponseBody
  @ResponseHeader('content-type', 'application/json')
  @ResponseHeader('Access-Control-Allow-Origin', '*')
  @ResponseHeader('Access-Control-Allow-Headers', '*')
  @ResponseHeader('Access-Control-Allow-Methods', '*')
  async getMangas(): Promise<Manga[]> {
    const mangas = MangaDownloader.getAllRecord();
    return mangas;
  }

  @RequestMapping({
    path: '/del/{mangaName}',
  })
  @ResponseBody
  @ResponseHeader('content-type', 'application/json')
  @ResponseHeader('Access-Control-Allow-Origin', '*')
  @ResponseHeader('Access-Control-Allow-Headers', '*')
  @ResponseHeader('Access-Control-Allow-Methods', '*')
  async delManga(@PathVariable() mangaName: string): Promise<string> {
    await fs.removeSync(path.join(MangaDownloader.imgBaseDir, mangaName));
    return 'success';
  }

  @RequestMapping({
    path: '/markread/{mangaName}',
  })
  @ResponseBody
  @ResponseHeader('content-type', 'application/json')
  @ResponseHeader('Access-Control-Allow-Origin', '*')
  @ResponseHeader('Access-Control-Allow-Headers', '*')
  @ResponseHeader('Access-Control-Allow-Methods', '*')
  async markReadManga(
    @PathVariable() mangaName: string,
    @RequestParam() readedStatus: boolean,
  ): Promise<string> {
    const manga = MangaDownloader.getRecord(mangaName);
    manga.hasBeenRead = readedStatus;
    MangaDownloader.writeRecord(mangaName, manga);
    return 'success';
  }

  @RequestMapping({
    path: '/collect/{mangaName}',
  })
  @ResponseBody
  @ResponseHeader('content-type', 'application/json')
  @ResponseHeader('Access-Control-Allow-Origin', '*')
  @ResponseHeader('Access-Control-Allow-Headers', '*')
  @ResponseHeader('Access-Control-Allow-Methods', '*')
  async setIsCollect(
    @PathVariable() mangaName: string,
    @RequestParam() isCollect: boolean,
  ): Promise<string> {
    const manga = MangaDownloader.getRecord(mangaName);
    manga.hasBeenCollected = isCollect;
    MangaDownloader.writeRecord(mangaName, manga);
    return 'success';
  }

  @RequestMapping({
    path: '/download',
  })
  @ResponseBody
  @ResponseHeader('content-type', 'application/json')
  @ResponseHeader('Access-Control-Allow-Origin', '*')
  @ResponseHeader('Access-Control-Allow-Headers', '*')
  @ResponseHeader('Access-Control-Allow-Methods', '*')
  async download(
    @RequestParam() name: string,
    @RequestParam() id: string,
    @Method method: string,
  ): Promise<{ status: 'success' | 'fail'; error?: any } | null> {
    try {
      if (method === 'OPTIONS') {
        return null;
      }
      console.log(name, id);
      // await this.nick.download(name, id, true);
      return {
        status: 'success',
      };
    } catch (error) {
      console.error(error);
      return {
        status: 'fail',
        error: error instanceof Error ? error.message : error,
      };
    }
  }

  @RequestMapping({
    path: '/readpoint',
  })
  @ResponseHeader('content-type', 'application/json')
  @ResponseHeader('Access-Control-Allow-Origin', '*')
  @ResponseHeader('Access-Control-Allow-Headers', '*')
  @ResponseHeader('Access-Control-Allow-Methods', '*')
  @ResponseBody
  async getReadpoint(@RequestParam() manga: string): Promise<ReadPoint> {
    const locate = path.join(
      MangaDownloader.imgBaseDir,
      manga,
      MangaDownloader.readPointName,
    );

    try {
      const file = await fs.readFile(locate, 'utf-8');
      return JSON.parse(file);
    } catch (e) {
      const initReadPoint: ReadPoint = {
        mangaName: manga,
        chapters: 1,
        volumes: 1,
      };
      fs.writeFileSync(locate, JSON.stringify(initReadPoint));
      return initReadPoint;
    }
  }

  @RequestMapping({
    path: '/writepoint',
  })
  @ResponseHeader('content-type', 'application/json')
  @ResponseHeader('Access-Control-Allow-Origin', '*')
  @ResponseHeader('Access-Control-Allow-Headers', '*')
  @ResponseHeader('Access-Control-Allow-Methods', '*')
  @ResponseBody
  async writeReadpoint(
    @RequestBody body: ReadPoint,
    @Method method: string,
  ): Promise<object | null> {
    if (method === 'OPTIONS') {
      return null;
    }
    if (!body || !body.mangaName) {
      return {};
    }
    const locate = path.join(
      MangaDownloader.imgBaseDir,
      body.mangaName,
      MangaDownloader.readPointName,
    );
    fs.writeFileSync(locate, JSON.stringify(body));
    return {};
  }

  @RequestMapping({
    path: '/imgs/**/*',
  })
  @ResponseHeader('cache-control', `public, max-age=${String(2 * 60 * 60)}`)
  @ResponseBody
  img(request: WebRequest): Buffer {
    const imgLocate = path.join(
      MangaDownloader.imgBaseDir,
      path.join(decodeURI(request.getRequest().url?.replace('imgs', '') ?? '')),
    );
    request.setContentType(
      `image/${MangaDownloader.extractSuffixFromUrl(
        request.getRequest().url || '',
      )}`,
    );
    return fs.readFileSync(imgLocate);
  }

  @RequestMapping({ path: '*' })
  html(
    // @RequestHeader('content-type') contentType: string,
    webReqest: WebRequest,
  ): string {
    const req = webReqest.getRequest();
    const urlPath = req.url || '';
    const target = path.join(this.staticBase, urlPath);
    if (fs.existsSync(target)) {
      const targetStatus = fs.statSync(target);
      if (targetStatus.isFile()) {
        if (target.includes('.js')) {
          webReqest.setHeader({
            'content-type': 'application/javascript; charset=utf-8',
          });
        } else if (target.includes('.css')) {
          webReqest.setHeader({
            'content-type': 'text/css; charset=utf-8',
          });
        }
        if (!target.endsWith('.html')) {
          webReqest.setHeader({
            'cache-control': `public, max-age=${String(30 * 24 * 60 * 60)}`,
          });
        }
        webReqest.response(fs.createReadStream(target));
        return '';
      }
    }

    return path.join(this.staticBase, 'index.html');
  }

  @RequestMapping({ path: '/log' })
  log(@RequestParam() log: string, reqeust: WebRequest): string {
    console.log(log);
    reqeust.response('');
    return '';
  }
}
