import type { StatTotals } from "./leaderboard";
import type { Role, RoleAssignment } from "./role";

export interface PlayerRolePerformance extends StatTotals {
    role: RoleAssignment
}

export function playerPerformanceKey(name: string, role: Role) {
    const k = `${name}-${role}`;
    return k;
}
