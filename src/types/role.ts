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
    "Many",
    "",
] as const;

export type Role = typeof kRoles[number];

export interface RoleAssignment {
    role: Role;
    inferred?: boolean;
};
