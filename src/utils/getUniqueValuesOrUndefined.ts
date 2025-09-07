export function getUniqueValuesOrUndefined<T>(items?: T[]): T[] | undefined {
    if (items) {
        if (items.length > 0) {
            return Array.from(new Set(items));
        }
    }
    return undefined;
}
