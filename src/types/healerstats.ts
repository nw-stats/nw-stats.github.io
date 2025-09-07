import type { Role } from "./role";

export interface HealerStats {
    role: Role;
    healing: number;
    selfDeaths: number;
    groupDeaths: number;
    qdpsDeaths: number;
}
