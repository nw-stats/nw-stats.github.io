
export function toLiteral<T extends readonly string[]>(validValues: T, value: string, fallback: T[number]): T[number] {
    return (validValues.includes(value as T[number]) ? value : fallback) as T[number];
}
