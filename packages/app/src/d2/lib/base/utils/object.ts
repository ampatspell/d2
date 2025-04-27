let _guid = 0;
const _cache = new WeakMap<object, number>();

export const guidFor = (object: object) => {
  let guid = _cache.get(object);
  if (!guid) {
    guid = ++_guid;
    _cache.set(object, guid);
  }
  return `${guid}`;
};

export const nameOf = (object: object) => {
  return object.constructor.name;
};

export const serialized = <T>(object: T, keys: (keyof T)[]) => {
  const hash: Record<PropertyKey, unknown> = {};
  keys.forEach((key) => {
    const value = object[key];
    if (value !== undefined) {
      hash[key] = value;
    }
  });
  return hash;
};

export const serializedToString = (serialized?: Record<PropertyKey, unknown>) => {
  if (serialized) {
    return Object.keys(serialized)
      .map((key) => {
        let value = serialized[key];
        if(Array.isArray(value)) {
          value = `[${value.map(item => String(item)).join(', ')}]`;
        }
        return `${key}=${value}`;
      })
      .join(', ');
  }
};

export const description = (object: object, serialized?: Record<PropertyKey, unknown>) => {
  const props = serializedToString(serialized);
  return `<${nameOf(object)}:${guidFor(object)}${props ? ` {${props}}` : ''}>`;
};
