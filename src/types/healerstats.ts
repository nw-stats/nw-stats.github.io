import type { RoleAssignment } from "./role";
import type { GroupKey } from "./roster";

export interface HealerStats {
    character: string;
    roleAssignment: RoleAssignment;
    group: GroupKey;
    healing: number;
    groupDeaths: number;
    qdpsDeaths: number;
}
