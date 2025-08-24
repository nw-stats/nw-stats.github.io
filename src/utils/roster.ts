import { kRoles, type Role } from "../types/role";
import type { GroupKey } from "../types/roster";

export function isQpdsGroup(key: GroupKey) {
    return typeof key === 'string';
}

export function sortRolesStrings(a: string, b: string): number {
    const ai = kRoles.indexOf(a as Role);
    const bi = kRoles.indexOf(b as Role);

    if (ai !== -1 && bi !== -1) {
        return ai - bi;
    }
    if (ai !== -1 && bi === -1) {
        return -1;
    }
    if (ai === -1 && bi !== -1) {
        return 1;
    }
    if (a && b) {
        return a.localeCompare(b);
    }
    return -1;
}
