import type { DataType } from "../services/googlesheets";
import type { Faction } from "../types/faction";
import type { Role } from "../types/role";
import type { GroupKey } from "../types/roster";
import type { Status } from "../types/status";
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
    return String(value).trim();
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
    if (!value) return '';
    if (typeof value !== 'string') return '';

    const lower = value.toLowerCase();
    if (lower.includes('healer')) {
        if (lower.includes('aoe')) {
            return 'Healer AOE';
        } else if (lower.includes('ks')) {
            return 'Healer KS';
        }
        return 'Healer MB';
    }

    if (lower.includes('sender') || lower.includes('holder')) {
        return 'Disruptor'
    }

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

export function convertToStatus(value: DataType): Status {
    var s = convertString(value);
    if (s !== 'complete'
        && s !== 'pending'
        && s !== 'cancelled'
        && s !== 'given') {
        s = 'not started';
    }
    return s as Status;
}
