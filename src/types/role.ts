export const kRoles = [
    "Healer MB",
    "Healer AOE",
    "Healer KS",
    "Bruiser",
    "Tank",
    "Flail",
    "QDPS",
    "VG IG",
    "Disruptor",
    "Firestaff",
    "Ranged",
    "Blunderbuss",
    "Shotcaller",
    "Unassigned",
] as const;

export type Role = typeof kRoles[number];

export interface RoleAssignment {
    role: Role;
    inferred?: boolean;
};

export function isRole(value: string): value is Role {
    return kRoles.includes(value as Role);
}
