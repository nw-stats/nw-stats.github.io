import type { GroupKey } from "./roster";

export interface HealerStats {
    character: string;
    group: GroupKey;
    healing: number;
    groupDeaths: number;
    qdpsDeaths: number;
}
