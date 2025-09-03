export const validRoles = [
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


export interface Role {
    name: string;
    inferred?: boolean;
};
