export const validFactions = ["Marauder", "Syndicate", "Covenant", "Gray"] as const;
export type Faction = (typeof validFactions)[number];
