import type { Role } from "./role";
import type { GroupKey } from "./roster";

export interface HealerStats {
    character: string;
    role: Role;
    group: GroupKey;
    deaths: number;
    healing: number;
    groupDeaths: number;
    qdpsDeaths: number;
}
