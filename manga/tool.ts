import Request from 'better-request';
import { ms2Unit } from 'better-utils';
import Https from 'https';
import Http from 'http';
import { writeFile, createWriteStream } from 'better-fs';
import { WebRequest } from 'mvc';

export class Tool {
  private readonly agent =
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36';

  constructor(
    protected readonly root: string,
    private readonly downloadBatchNum: number = 20,
    private readonly logLevel: 'debug' | 'log' = 'debug',
  ) {}

  protected log(...msg: any[]) {
    console.log(...msg);
  }

  protected debug(...msg: any[]) {
    if (this.logLevel === 'debug') {
      this.log(...msg);
    }
  }

  protected wait(ms: number): Promise<void> {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve();
      }, ms);
    });
  }

  protected async runParallel<T>({
    tasks,
    msg = '',
    points = [30, 70],
    stopWhenError = false,
    interval = 0,
  }: {
    tasks: ((seq: number) => Promise<T>)[];
    msg?: string;
    points?: number[];
    stopWhenError?: boolean;
    interval?: number;
  }): Promise<{ success: number; fail: number; result: T[] }> {
    let startNum = 0;
    const total = tasks.length;
    let success = 0;
    let fail = 0;
    const result: T[] = [];
    this.debug(` ${msg} 开始, 总: ${tasks.length} 项`);
    const start = Date.now();
    let prev = start;
    while (tasks.length > 0) {
      const batchTasks = tasks.splice(0, this.downloadBatchNum);
      const t = await Promise.all(
        batchTasks.map(async (e, i) => {
          try {
            const result = await e(startNum + i);
            success++;
            const tipsPoint = points[0];
            if (tipsPoint) {
              if ((success / total) * 100 >= tipsPoint) {
                this.log(
                  `${msg} 完成 %${tipsPoint} 耗时:${ms2Unit(
                    Date.now() - prev,
                  )} 平均耗时:${ms2Unit(
                    Math.round((Date.now() - prev) / success),
                  )}`,
                );
                prev = Date.now();
                points.shift();
              }
            }
            return result;
          } catch (err) {
            fail++;
            if (stopWhenError) {
              throw err;
            } else {
              console.error(err);
            }
          }
        }),
      );

      result.push(...(t as T[]));
      startNum += batchTasks.length;
      await this.wait(interval);
    }
    this.log(
      `${msg} 完成 100% 成功:${success} 失败:${fail} 总耗时:${ms2Unit(
        Date.now() - start,
      )} 平均耗时:${ms2Unit(Math.round((Date.now() - start) / success))}`,
    );
    return { success, fail, result };
  }

  private httpsAgent = new Https.Agent({
    keepAlive: false,
    maxSockets: 100,
  });
  private httpAgent = new Http.Agent({
    keepAlive: false,
    maxSockets: 100,
  });

  protected async get(url: string, header?: any, handler?: any[]) {
    try {
      let referer = this.root;
      if (!url.startsWith(this.root)) {
        const u = new URL(url);
        referer = `${u.protocol}//${u.host}`;
      }
      return await Request.fetch(
        {
          url,
          method: 'GET',
          header: {
            'user-agent': this.agent,
            referer,
            ...(header && { ...header }),
          },
          errorRetryInterval: 5000,
          errorRetry: 10,
          ...(handler && { responseHandlers: handler }),
        },
        null,
      );
    } catch (err) {
      if (err instanceof Error) {
        err.message += ` url: ${url}`;
      }
      throw err;
    }
  }

  protected async fetchThenSaveImg(
    url: string,
    locate: string,
    type: 'pipe' | 'buf' = 'pipe',
    response?: WebRequest,
  ) {
    try {
      let referer = this.root;
      if (!url.startsWith(this.root)) {
        const u = new URL(url);
        referer = `${u.protocol}//${u.host}`;
      }
      const request = new Request({
        url,
        method: 'GET',
        header: {
          'user-agent': this.agent,
          referer,
        },
        agent: url.startsWith('https') ? this.httpsAgent : this.httpAgent,
        responseHandlers: ['status', 'redirect'],
        errorRetryInterval: 1000,
        errorRetry: 3,
      });
      if (type === 'pipe') {
        if (response) {
          await request.fetchThenPipe(null, response.getResponse());
        } else {
          await request.fetchThenPipe(null, createWriteStream(locate));
        }
      } else {
        const buf = await request.fetch(null);
        await writeFile(locate, buf);
      }
    } catch (err) {
      if (err instanceof Error) {
        err.message += ` url: ${url}`;
      }
      throw err;
    }
  }
}
