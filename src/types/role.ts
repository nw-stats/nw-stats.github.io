import type { GroupKey } from "./roster";

export const KRoleCodes = {
    "Healer MB": "MBH",
    "Healer AOE": "AOEH",
    "Healer KS": "KSH",

    "Bruiser": "BRSR",
    "Tank": "TANK",
    "Flail": "FL",

    "DPS": "DPS",
    "QDPS": "QDPS",
    "VG IG": "VGIG",
    "KS VG": "KSVG",

    "Disruptor": "DISR",
    "Shotcaller": "SHOT",
    "Point Spear": "PSPR",
    "Unassigned": "--",
} as const;

export type Role = keyof typeof KRoleCodes;

export const roleKeys = Object.keys(
    KRoleCodes
) as (keyof typeof KRoleCodes)[];

export function isRole(value: string): value is Role {
    return roleKeys.includes(value as Role);
}

export interface RoleAssignment {
    role: Role;
    inferred?: boolean;
}

export const roleOrder: Role[] = [
    "Healer MB",
    "Healer AOE",
    "Healer KS",
    "Bruiser",
    "Point Spear",
    "Tank",
    "Flail",
    "DPS",
    "QDPS",
    "VG IG",
    "KS VG",
    "Disruptor",
    "Shotcaller",
    "Unassigned",
];
export function isQpdsGroup(key: GroupKey) {
    return typeof key === 'string';
}
const roleIndex = new Map(
    roleOrder.map((role, i) => [role, i])
);
export function sortRolesStrings(a: string, b: string): number {
    const ai = isRole(a) ? roleIndex.get(a) : undefined;
    const bi = isRole(b) ? roleIndex.get(b) : undefined;

    if (ai !== undefined && bi !== undefined) {
        return ai - bi;
    }

    if (ai !== undefined) return -1;
    if (bi !== undefined) return 1;

    return a.localeCompare(b);
}
