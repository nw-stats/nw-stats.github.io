export function makeWarDetailSlug(attackerName: string, defenderName: string): string {
    return `${attackerName}-vs-${defenderName}`;
}
