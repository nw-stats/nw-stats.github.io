export function getOrCreate<K, T>(map: Map<K, T>, key: K, ctor: () => T): T {
    let value = map.get(key);
    if (!value) {
        value = ctor();
        map.set(key, value);
    }
    return value;
}
