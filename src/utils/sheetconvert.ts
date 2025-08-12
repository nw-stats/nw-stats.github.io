import type { DataType } from "../services/googlesheets";
import type { Faction } from "../types/faction";
import type { Role } from "../types/role";

export function convertInt(value: DataType): number {
    return parseInt(String(value));
}

export function convertString(value: DataType): string {
    if (value === null) {
        return '';
    }
    return String(value);
}
export function convertStringArray(value: DataType, delim?: string): string[] {
    const d = delim ? delim : ',';
    const s = convertString(value);
    if (s === '') {
        return [];
    }
    return convertString(value).split(d).map(v => v.trim());
}

export function convertFaction(value: DataType): Faction {
    return value as Faction;
}

export function convertRole(value: DataType): Role {
    return value as Role;
}
