import { ClientRequest } from 'http';
import InfoParser from './info_parser';

export default class PathParser implements InfoParser {
  private path: string;
  private pathVariable: [number, string][] = [];
  constructor(path: string) {
    this.path = path.replace(/\/+/g, '/');
    this.setPathVariable();
  }

  getPath() {
    return this.path;
  }
  match(req: ClientRequest) {
    return this.matchBlock(this.path.split('/'), req.path.split('/'), 0, 0);
  }

  merge(sub: PathParser) {
    return new PathParser(this.path + sub.getPath());
  }

  private matchBlock(
    pBlock: string[],
    tBlock: string[],
    pIndex: number,
    tIndex: number,
  ): boolean {
    while (pIndex < pBlock.length && tIndex < tBlock.length) {
      if (pBlock[pIndex] === '**') {
        pIndex++;
        let res = false;
        for (
          let i = 0, len = tBlock.length - tIndex;
          i < len && res !== true;
          i++
        ) {
          res = this.matchBlock(pBlock, tBlock, pIndex, tIndex + i);
        }
        return res;
      }
      if (this.isPathVariable(pBlock[pIndex])) {
        pIndex++;
        tIndex++;
        continue;
      }
      if (!this.matchInner(pBlock[pIndex], tBlock[tIndex], 0, 0)) {
        return false;
      }
      pIndex++;
      tIndex++;
    }
    if (pIndex !== pBlock.length - 1) {
      return false;
    }
    return true;
  }

  private matchInner(
    pBlock: string,
    tBlock: string,
    pIndex: number,
    tIndex: number,
  ): boolean {
    while (pIndex < pBlock.length && tIndex < tBlock.length) {
      const pChar = pBlock[pIndex];
      const tChar = tBlock[tIndex];
      if (pChar === '*') {
        let res = false;
        for (
          let i = 0, len = tBlock.length - tIndex - 1;
          i < len && !res;
          i++
        ) {
          res = this.matchInner(pBlock, tBlock, pIndex + 1, tIndex + i);
        }
        return res;
      }
      if (pChar === '?' || pChar === tChar) {
        pIndex++;
        tIndex++;
      } else {
        return false;
      }
    }
    if (pIndex !== pBlock.length - 1 || tIndex !== tBlock.length - 1) {
      return false;
    }
    return true;
  }

  private setPathVariable() {
    this.path.split('/').forEach((part, index) => {
      if (this.isPathVariable(part)) {
        this.pathVariable.push([index, part.slice(1, part.length - 1)]);
      }
    });
  }

  private isPathVariable(part: string) {
    return part[0] === '{' && part[part.length - 1] === '}';
  }
}
