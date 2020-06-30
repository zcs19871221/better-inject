import path from 'path';
import fs from 'fs';

export default class LocateParser {
  private root: string;
  private locates: string[] = [];
  private hasParsed: boolean = false;
  private filePaths: string[];
  constructor(filePaths: string | string[], root?: string) {
    this.root = root ? root : this.guessRoot();
    if (typeof filePaths === 'string') {
      filePaths = [filePaths];
    }
    this.filePaths = filePaths;
  }

  private guessRoot() {
    let cur = process.cwd();
    let prev;
    do {
      if (fs.existsSync(path.join(cur, 'package.json'))) {
        return cur;
      }
      prev = cur;
      cur = path.join(cur, '../');
    } while (cur !== prev);
    return process.cwd();
  }

  private parseLocate(): string[] {
    return this.filePaths.reduce((acc: string[], locate) => {
      locate = path.normalize(locate);
      const dirs = locate.split(path.sep);
      if (dirs.length === 1) {
        acc.push(path.join(this.root, dirs[0]));
        return acc;
      }
      let base = this.getBase(<string>dirs.shift());
      let file = <string>dirs.pop();
      let target = <string[]>[base];
      for (const dir of dirs) {
        const tmp: string[] = [];
        target.forEach(locate => {
          if (dir === '**') {
            this.getDirs(locate).forEach(dir => {
              tmp.push(dir);
            });
          } else {
            tmp.push(path.join(locate, dir));
          }
        });
        target = tmp;
      }
      const res: string[] = [];
      target.forEach(dir => {
        if (file.includes('*')) {
          this.getFiles(dir).forEach(fileLocate => {
            if (fileLocate.match(new RegExp(file.replace(/\*/g, '.*')))) {
              res.push(fileLocate);
            }
          });
        } else {
          res.push(path.join(dir, file));
        }
      });
      acc.push(...res.filter(file => fs.existsSync(file)));
      return acc;
    }, []);
  }

  private getBase(firstSeprateDir: string): string {
    if (/^(\/|[a-z]:)/i.test(firstSeprateDir)) {
      return firstSeprateDir;
    }
    return path.join(this.root, firstSeprateDir);
  }

  private getDirs(dir: string) {
    return fs
      .readdirSync(dir)
      .map(file => path.join(dir, file))
      .filter(file => fs.statSync(file).isDirectory());
  }

  private getFiles(dir: string) {
    return fs
      .readdirSync(dir)
      .map(file => path.join(dir, file))
      .filter(file => !fs.statSync(file).isDirectory());
  }

  getLocates() {
    if (!this.hasParsed) {
      this.hasParsed = true;
      this.locates = this.parseLocate();
    }
    return this.locates;
  }

  getRoot() {
    return this.root;
  }
}
