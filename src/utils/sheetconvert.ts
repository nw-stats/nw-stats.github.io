import type { DataType } from "../services/googlesheets";
import type { Faction } from "../types/faction";
import type { Role } from "../types/role";
import type { GroupKey } from "../types/roster";
import type { Region, WorldKind, WorldSet } from "../types/world";

export function convertInt(value: DataType): number {
    return parseInt(String(value));
}

export function convertBoolean(value: DataType): boolean {
    return Boolean(value);
}

export function convertString(value: DataType): string {
    if (value === null) {
        return '';
    }
    return String(value);
}
export function convertGroupKey(value: DataType): GroupKey {
    if (typeof value === 'number') {
        return convertInt(value) as GroupKey;
    }
    return convertString(value);
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
    if (typeof value !== 'string') {
        return 'Gray';
    }
    return value as Faction;
}

export function convertRole(value: DataType): Role {
    return value as Role;
}

export function convertRegion(value: DataType): Region {
    return value as Region;
}

export function convertWorldSet(value: DataType): WorldSet {
    return value as WorldSet;
}

export function convertWorldKind(value: DataType): WorldKind {
    return value as WorldKind;
}
