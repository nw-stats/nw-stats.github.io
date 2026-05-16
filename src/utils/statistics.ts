export function mean(values: number[]): number {
    const n = values.length;
    if (n > 0) {
        const s = values.reduce((p, c) => p + c, 0);
        return s / n;
    }
    return 0;
}

export function variance(values: number[], mean: number): number {
    const n = values.length;
    if (n > 0) {
        const d = values.reduce((p, c) => p + c - mean, 0);
        return d / n
    }
    return 0;
}
