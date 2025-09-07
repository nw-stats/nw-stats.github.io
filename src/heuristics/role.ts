import type { Role } from "../types/role";

function isRoleString(role: string, compareTo: string) {
    return role.toLowerCase().includes(compareTo);
}

export function isHealer(role: Role): boolean {
    return isRoleString(role.name, 'healer');
}

export function isAoeHealer(role: Role): boolean {
    return isHealer(role) && isRoleString(role.name, 'aoe');
}

export function isGroupHealer(role: Role): boolean {
    return isHealer(role)
        && (isRoleString(role.name, 'mb')
            || isRoleString(role.name, 'st'));
}
