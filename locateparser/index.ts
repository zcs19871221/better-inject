import path from 'path';
import fs from 'fs';

export default class LocateParser {
  private root: string;
  private filePaths: string[];
  private buildDir: string;
  constructor(
    filePaths: string | string[],
    root: string,
    buildDir: string = 'dist',
  ) {
    this.root = path.normalize(root);
    if (typeof filePaths === 'string') {
      filePaths = [filePaths];
    }
    this.filePaths = filePaths;
    this.buildDir = buildDir;
  }

  private srcMapBuild(srcLocate: string): string {
    srcLocate = path.normalize(srcLocate);
    if (srcLocate.startsWith(this.root)) {
      return srcLocate
        .replace(
          this.root,
          path.join(`${this.root}`, path.sep, this.buildDir, path.sep),
        )
        .replace('.ts', '');
    }
    return srcLocate;
  }

  require(srcLoate: string) {
    const target = require(this.srcMapBuild(srcLoate)).default;
    return target;
  }

  getLocates(): string[] {
    return this.filePaths.reduce((acc: string[], locate) => {
      locate = path.normalize(locate);
      const dirs = locate.split(path.sep);
      if (dirs.length === 1) {
        acc.push(path.join(this.root, dirs[0]));
        return acc;
      }
      const file = <string>dirs.pop();
      const res: string[] = [];
      const preDirs = this.parseDirs(dirs, <string[]>[
        this.getBase(<string>dirs.shift()),
      ]);
      preDirs.forEach(dir => {
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

  private parseDirs(dirs: string[], preDirs: string[]) {
    for (const dir of dirs) {
      const tmp: string[] = [];
      preDirs.forEach(locate => {
        if (dir === '**') {
          this.getDirs(locate).forEach(dir => {
            tmp.push(dir);
          });
        } else {
          tmp.push(path.join(locate, dir));
        }
      });
      preDirs = tmp;
    }
    return preDirs;
  }

  addPaths(filePaths: string[] | string) {
    this.filePaths = this.filePaths.concat(filePaths);
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

  getRoot() {
    return this.root;
  }
}
