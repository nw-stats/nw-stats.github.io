
import type { Role } from "../types/role";

export function isRoleFuzzy(role: Role, compare: string): boolean {
    const rolestr = (role as string).toLowerCase();
    const ccc = compare.toLowerCase();

    return rolestr.includes(ccc);
}

export function isHealer(role: Role): boolean {
    return role === "Healer AOE" || role === "Healer MB" || role === "Healer KS";
}
