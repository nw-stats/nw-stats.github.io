export function formatCompact(value: number): string {
    return Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 0 }).format(value);
}

export function formatThousands(value: number, figures?: number): string {
    try {
        return value.toLocaleString(undefined, {
            minimumFractionDigits: figures,
            maximumFractionDigits: figures,
        });
    } catch (err) {
        return "";
    }
}

export function formatPercent(value: number, figures?: number): string {
    const pct = value * 100;
    const fixed = pct.toFixed(figures);
    return `${fixed}%`;
}
