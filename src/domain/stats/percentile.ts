function erf(x: number) {
    const sign = x >= 0 ? 1 : -1;
    x = Math.abs(x);

    const a1 = 0.254829592;
    const a2 = -0.284496736;
    const a3 = 1.421413741;
    const a4 = -1.453152027;
    const a5 = 1.061405429;
    const p = 0.3275911;

    const t = 1 / (1 + p * x);
    const y =
        1 -
        (((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t) *
        Math.exp(-x * x);

    return sign * y;
}

export function zToPercentile(z: number, inverse: boolean = false) {
    const p = 0.5 * (1 + erf(z / Math.sqrt(2)));
    return inverse ? 1 - p : p
}


export function zToGrade(z: number, inverse: boolean = false): string {
    const p = zToPercentile(z, inverse);
    if (p >= 0.98) return "S+";
    if (p >= 0.90) return "S";
    if (p >= 0.75) return "A";
    if (p >= 0.50) return "B";
    if (p >= 0.25) return "C";
    if (p >= 0.10) return "D";
    return "F";
}
