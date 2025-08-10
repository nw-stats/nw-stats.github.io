import type { DataType } from "../services/googlesheets";
import type { Faction } from "../types/faction";

export function convertInt(value: DataType): number {
    return parseInt(String(value));
}

export function convertString(value: DataType): string {
    return String(value);
}
export function convertStringArray(value: DataType, delim?: string): string[] {
    const d = delim ? delim : ',';
    return convertString(value).split(d).map(v => v.trim());
}

export function convertFaction(value: DataType): Faction {
    return value as Faction;
}
