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

import { Manga, MangaPreview, ReadPoint } from './manga';

const imgPath = (mangaName: string, volumeName: string, imgName: string) =>
  `/img/${mangaName}/${volumeName}/${imgName}`;

const imgPathRoute = imgPath('{mangaName}', '{volumeName}', '{imgName}');

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
  async getMangas(): Promise<MangaPreview[]> {
    const mangas = JSON.parse(
      await fs.readFile(Manga.mangasJson, 'utf-8'),
    ) as MangaPreview[];
    return mangas.map(e => ({
      ...e,
      cover: imgPath(e.name, 'cover', e.cover),
    }));
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
    const mangas = JSON.parse(
      await fs.readFile(Manga.mangasJson, 'utf-8'),
    ) as MangaPreview[];
    await fs.removeSync(path.join(Manga.imgBaseDir, mangaName));
    await fs.writeFile(
      Manga.mangasJson,
      JSON.stringify(
        mangas.filter(e => e.name != mangaName),
        null,
        2,
      ),
    );
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
    const mangas = JSON.parse(
      await fs.readFile(Manga.mangasJson, 'utf-8'),
    ) as MangaPreview[];
    const t = mangas.find(e => e.name === mangaName);
    if (t) {
      t.readed = readedStatus;
    }
    await fs.writeFile(Manga.mangasJson, JSON.stringify(mangas, null, 2));
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
    const mangas = JSON.parse(
      await fs.readFile(Manga.mangasJson, 'utf-8'),
    ) as MangaPreview[];
    const t = mangas.find(e => e.name === mangaName);
    if (t) {
      t.isCollect = isCollect;
    }
    await fs.writeFile(Manga.mangasJson, JSON.stringify(mangas, null, 2));
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
  async getReadpoint(@RequestParam() manga: string): Promise<object | null> {
    const locate = path.join(Manga.imgBaseDir, manga, Manga.readPointName);
    if (await fs.isExist(locate)) {
      const file = await fs.readFile(locate, 'utf-8');
      try {
        return JSON.parse(file);
      } catch (e) {
        console.error(locate, file);
      }
    }
    return null;
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
      Manga.imgBaseDir,
      body.mangaName,
      Manga.readPointName,
    );
    fs.writeFileSync(locate, JSON.stringify(body));
    return {};
  }

  @RequestMapping({
    path: imgPathRoute,
  })
  @ResponseHeader('cache-control', `public, max-age=${String(2 * 60 * 60)}`)
  @ResponseBody
  img(
    @PathVariable() mangaName: string,
    @PathVariable() volumeName: string,
    @PathVariable() imgName: string,
    request: WebRequest,
  ): Buffer {
    mangaName = decodeURI(mangaName);
    volumeName = decodeURI(volumeName);
    imgName = decodeURI(imgName);
    const imgLocate = path.join(
      Manga.imgBaseDir,
      mangaName,
      ...(volumeName === 'cover' ? [imgName] : [volumeName, imgName]),
    );
    request.setContentType(
      `image/${Manga.extractSuffixFromUrl(request.getRequest().url || '')}`,
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
