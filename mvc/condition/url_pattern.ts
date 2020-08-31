export default class UrlPattern {
  private isCatchAll: boolean = false;
  private size: number;
  private url: string;
  private pathVariable: {
    [name: string]: number;
  } = {};
  private variableCount: number = 0;
  private wildcardCount: number = 0;
  constructor(url: string) {
    url = url.trim().replace(/\/+/g, '/');
    this.size = url.length;
    this.url = url;
    if (url === '*') {
      this.isCatchAll = true;
    }
    this.parse();
  }

  hashCode() {
    return this.url;
  }

  combine(other: UrlPattern) {
    if (this.isEmpty() && !other.isEmpty()) {
      return other;
    }
    if (!this.isEmpty() && other.isEmpty()) {
      return this;
    }
    if (this.isEmpty() && other.isEmpty()) {
      return this;
    }
    const urlBlocks = this.url.split('/');
    const lastBlock = urlBlocks[urlBlocks.length - 1];
    const lastMatched = lastBlock.match(/^\*(\.[^.]+)?$/);
    if (!lastMatched) {
      return new UrlPattern(`${this.url}/${other.getContent()}`);
    }
    urlBlocks.pop();
    const otherBlocks = other.getContent().split('/');
    if (otherBlocks[0].endsWith('.*') && lastMatched[1]) {
      otherBlocks[0] = otherBlocks[0].replace(/\\.\*$/, lastMatched[1]);
    }
    return new UrlPattern(urlBlocks.join('/') + '/' + otherBlocks.join('/'));
  }

  compareTo(b: UrlPattern) {
    if (this.isEmpty() && !b.isEmpty()) {
      return 1;
    }
    if (!this.isEmpty() && b.isEmpty()) {
      return -1;
    }
    if (this.isEmpty() && b.isEmpty()) {
      return 0;
    }
    if (this.isCatchAll && !b.isCatchAll) {
      return 1;
    }
    if (!this.isCatchAll && b.isCatchAll) {
      return -1;
    }
    if (this.isCatchAll && b.isCatchAll) {
      return b.size - this.size;
    }
    let scorePri = this.getScore() - b.getScore();
    if (scorePri !== 0) {
      return scorePri;
    }
    return b.size - this.size;
  }

  getMatchingCondition(url: string) {
    if (this.isEmpty()) {
      return this;
    }
    if (this.matchBlock(this.url.split('/'), url.split('/'), 0, 0)) {
      return this;
    }
    return null;
  }

  getContent() {
    return this.url;
  }

  isEmpty() {
    return this.url === '';
  }

  private getScore() {
    return this.variableCount * 1 + this.wildcardCount * 100;
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

  private parse() {
    this.url.split('/').forEach((part, index) => {
      for (const char of part) {
        if (char === '*') {
          this.wildcardCount += 1;
        }
      }
      if (this.isPathVariable(part)) {
        this.pathVariable[part.slice(1, part.length - 1)] = index;
        this.variableCount += 1;
      }
    });
  }

  private isPathVariable(part: string) {
    return part[0] === '{' && part[part.length - 1] === '}';
  }
}
