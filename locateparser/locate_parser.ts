import path from 'path';
import fs from 'fs';

export default class LocateParser {
  private root: string;
  private locates: string[];
  constructor(filePaths: string | string[], root: string = __dirname) {
    this.root = root;
    if (typeof filePaths === 'string') {
      filePaths = [filePaths];
    }
    this.locates = this.parseLocate(filePaths);
  }

  private parseLocate(filePaths: string[]): string[] {
    return filePaths.reduce((acc: string[], locate) => {
      locate = path.normalize(locate);
      const dirs = locate.split(path.sep);
      if (dirs.length === 1) {
        return [path.join(this.root, dirs[0])];
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
      const res = [];
      target.forEach(dir => {
        if (file.includes('*')) {
          this.getFiles(dir).forEach(file => {
            if (file.match(new RegExp(file.replace(/\*/g, '.*')))) {
              res.push(path.join(dir, file));
            }
          });
        } else {
          res.push(path.join(dir, file));
        }
      });
      acc.push(...target.filter(file => fs.existsSync(file)));
      return acc;
    }, []);
  }

  private getBase(firstSeprateDir: string): string {
    if (/^(\/|[a-z])/.test(firstSeprateDir)) {
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
    return this.locates;
  }

  getRoot() {
    return this.root;
  }
}
