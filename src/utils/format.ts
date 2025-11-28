export function formatCompact(value: number): string {
    return Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 0 }).format(value);
}

export function formatThousands(value: number, figures?: number): string {
    try {
        return value.toLocaleString(undefined, {
            minimumFractionDigits: figures,
            maximumFractionDigits: figures,
        });
    } catch {
        return "";
    }
}

export function formatPercent(value: number, figures?: number): string {
    const pct = value * 100;
    const fixed = pct.toFixed(figures);
    return `${fixed}%`;
}

export function numberOrNLetters(value: string, limit?: number): string {
    const _limit = limit ? limit : 1;
    return isNaN(Number(value)) ? value.slice(0, _limit) : value;
}
