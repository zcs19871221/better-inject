export default class PathPattern {
  private isCatchAll: boolean = false;
  private size: number;
  private pattern: string;
  private variableCount: number = 0;
  private wildcardCount: number = 0;
  private variableMap: Map<string, string>;
  private tmpMap: Map<string, string> = new Map();
  constructor(pattern: string, variableMap: Map<string, string> = new Map()) {
    pattern = this.format(pattern);
    this.size = pattern.length;
    this.pattern = pattern;
    this.variableMap = variableMap;
    if (pattern.endsWith('*')) {
      this.isCatchAll = true;
    }
    this.count();
  }

  getVariableMap() {
    return this.variableMap;
  }

  isPureUrlPattern() {
    return this.variableCount === 0 && this.wildcardCount === 0;
  }

  hashCode() {
    return this.pattern;
  }

  private splitBlock(block: string): [string, string] {
    const reg = /^([^.]*)\.?(.*)$/;
    const [, name, ext] = block.match(reg) || [, '', ''];
    return [name || '', ext || ''];
  }

  combine(other: PathPattern) {
    if (this.isEmpty() && !other.isEmpty()) {
      return other;
    }
    if (!this.isEmpty() && other.isEmpty()) {
      return this;
    }
    if (this.isEmpty() && other.isEmpty()) {
      return this;
    }
    const removeStartSlash = /^\//;
    const thisBlocks = this.pattern.replace(removeStartSlash, '').split('/');
    const thisLastBlock = thisBlocks[thisBlocks.length - 1];
    const [lastName, lastExt] = this.splitBlock(thisLastBlock);
    if (lastName === '*' || lastExt === '*') {
      const otherBlocks = other
        .getContent()
        .replace(removeStartSlash, '')
        .split('/');
      const [otherLastName, otherLastExt] = this.splitBlock(otherBlocks[0]);
      let name = otherLastName;
      let ext = otherLastExt;
      if (otherLastName === '*' && lastName !== '*') {
        name = lastName;
      }
      if (['*', ''].includes(otherLastExt) && lastExt !== '*') {
        ext = lastExt;
      }
      const block = `${name}${ext ? `.${ext}` : ''}`;
      thisBlocks.pop();
      otherBlocks.shift();
      return new PathPattern(
        '/' +
          thisBlocks
            .concat(block)
            .concat(otherBlocks)
            .join('/'),
      );
    }
    return new PathPattern(`${this.pattern}/${other.getContent()}`);
  }

  compareTo(b: PathPattern) {
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

  getMatchingCondition(url: string): PathPattern | null {
    this.tmpMap = new Map();
    url = this.format(url);
    if (this.isEmpty()) {
      return this;
    }
    if (this.isPureUrlPattern()) {
      return this.pattern === url ? this : null;
    }
    if (this.pattern === '*') {
      return this;
    }
    if (this.matchBlock(this.pattern.split('/'), url.split('/'), 0, 0)) {
      if ([...this.tmpMap.keys()].length > 0) {
        return new PathPattern(this.pattern, this.tmpMap);
      }
      return this;
    }
    return null;
  }

  getContent() {
    return this.pattern;
  }

  isEmpty() {
    return this.pattern === '';
  }

  private format(url: string) {
    url = url.trim().replace(/\/+/g, '/');
    return url;
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
          i <= len && res !== true;
          i++
        ) {
          res = this.matchBlock(pBlock, tBlock, pIndex, tIndex + i);
        }
        return res;
      }
      if (!this.matchInner(pBlock[pIndex], tBlock[tIndex], 0, 0)) {
        return false;
      }
      pIndex++;
      tIndex++;
    }
    if (pIndex == pBlock.length && tIndex === tBlock.length) {
      return true;
    }
    if (
      tIndex === tBlock.length &&
      pIndex === pBlock.length - 1 &&
      pBlock[pIndex] === '**'
    ) {
      return true;
    }
    return false;
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
        for (let i = 0, len = tBlock.length - tIndex; i <= len && !res; i++) {
          res = this.matchInner(pBlock, tBlock, pIndex + 1, tIndex + i);
        }
        return res;
      }
      if (pChar === '{') {
        let start = pIndex;
        let right = start;
        while (pBlock[right] !== '}' && right < pBlock.length) {
          right++;
        }
        if (pBlock[right] === '}') {
          const name = pBlock.slice(start + 1, right);
          let res = false;
          let findIndex = -1;
          for (let i = 0, len = tBlock.length - tIndex; i <= len && !res; i++) {
            findIndex = i;
            res = this.matchInner(pBlock, tBlock, right + 1, tIndex + i);
          }
          if (res) {
            this.tmpMap.set(name, tBlock.slice(tIndex, tIndex + findIndex));
          }
          return res;
        }
      }
      if (pChar === '?' || pChar === tChar) {
        pIndex++;
        tIndex++;
      } else {
        return false;
      }
    }
    if (pIndex === pBlock.length && tIndex === tBlock.length) {
      return true;
    }
    if (
      tIndex === tBlock.length &&
      pIndex === pBlock.length - 1 &&
      pBlock[pIndex] === '*'
    ) {
      return true;
    }
    return false;
  }

  private count() {
    let left = 0;
    let variable = 0;
    for (const char of this.pattern) {
      if (char === '*' || char === '?') {
        this.wildcardCount += 1;
      }
      if (char === '{') {
        left++;
      }
      if (char === '}' && left > 0) {
        left--;
        variable++;
      }
    }
    if (left > 0) {
      throw new Error('变量{}括号不配对');
    }
    this.variableCount = variable;
  }
}
