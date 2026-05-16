export function getHeatmapColor(
    value: number,
    maxAbs: number,
    negativeColor: string,
    neutralColor: string,
    positiveColor: string,
): string {

    const safeMax = Math.max(Math.abs(maxAbs), 1);

    const normalized = Math.min(Math.abs(value) / safeMax, 1);

    const percent = normalized * 100;

    // true neutral zone
    if (value === 0) {
        return neutralColor;
    }

    if (value > 0) {
        return `color-mix(in oklch, ${positiveColor} ${percent}%, ${neutralColor})`;
    }

    return `color-mix(in oklch, ${negativeColor} ${percent}%, ${neutralColor})`;
}
