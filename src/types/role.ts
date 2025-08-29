export const kRoles = [
    "Healer MB",
    "Healer AOE",
    "Bruiser",
    "Tank",
    "Shotcaller",
    "Flail",
    "QDPS",
    "VG IG",
    "Healer KS",
    "Disruptor",
    "Firestaff",
    "Ranged",
    "Blunderbuss",
    "Many",
    "",
] as const;

export type Role = typeof kRoles[number];

export interface RoleAssignment {
    role: Role;
    inferred?: boolean;
};
