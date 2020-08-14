const isClass = (v: any): boolean => {
  if (typeof v !== 'function') {
    return false;
  }
  return /^\s*class\s+/.test(v.toString());
};

const classToId = (ctr: any) => {
  if (ctr && ctr.name && typeof ctr.name === 'string') {
    return ctr.name.toLowerCase();
  }
  throw new Error(ctr + '不是类');
};

export { isClass, classToId };
