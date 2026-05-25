import { roleKeys, type Role } from "../../types/role";
import type { PerformanceProfile } from "./types";
import { createEmptyProfile } from "./utils";

export function normalizePlayerProfile(
    profile: Partial<Record<Role, PerformanceProfile>>
): Record<Role, PerformanceProfile> {

    const result = {} as Record<Role, PerformanceProfile>;

    for (const role of roleKeys) {
        result[role] = profile[role] ?? createEmptyProfile();
    }

    return result;
}
