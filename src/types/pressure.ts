export function calculatePressure(kills: number, deaths: number, assists: number): number {
    return kills + assists * 0.5 - deaths;
}
