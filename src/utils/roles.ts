import { validRoles } from "../types/role";

export function sortRoleStrings(a: string, b: string): number {
    const ia = validRoles.indexOf(a);
    const ib = validRoles.indexOf(b);
    return ia - ib;
}
