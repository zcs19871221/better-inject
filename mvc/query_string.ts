const merge = (object: { [prop: string]: any }, key: any, value: any) => {
  if (object[key] === undefined) {
    object[key] = value;
  } else if (Array.isArray(object[key])) {
    object[key] = [...new Set(object[key].concat(value))];
  } else if (object[key] !== value) {
    object[key] = [object[key], value];
  }
  return object;
};
const parse = (str: any): { [key: string]: any } => {
  if (!str.trim()) {
    return {};
  }
  return str
    .trim()
    .replace(/^\?/u, '')
    .split('&')
    .reduce((acc: { [index: string]: any }, each: any) => {
      const [key, value = ''] = each.split('=');
      const decoded = decodeURIComponent(value);
      return merge(acc, key, decoded);
    }, {});
};

const stringify = (obj: { [key: string]: any }): string => {
  return Object.entries(obj)
    .reduce((acc, [key, value]) => {
      if (value !== undefined) {
        if (!Array.isArray(value)) {
          value = [value];
        }
        return acc.concat(
          value.map((each: any) => {
            return `${key}=${encodeURIComponent(each)}`;
          }),
        );
      }
      return acc;
    }, [])
    .join('&');
};

export { stringify, parse, merge };
