import { useEffect, useState } from "react";

import { getLeaderboard } from "../services/leaderboardservice";
import { getRosterTable } from "../services/rosterservice";

import { kLeaderboardColumns } from "../mapping/leaderboardmap";

import type { Role } from "../types/role";
import type { CalculatedStat } from "../types/calculatedsstat";
import type { QueryParameter } from "../types/queryparameter";

import { Qop } from "../types/queryparameter";
import type { SheetId } from "../constants/sheets";

interface UseRoleStatisticsOptions {
    sheetId: SheetId;
    roles: Role[];
}

interface Totals {
    score: number;
    kills: number;
    deaths: number;
    assists: number;
    healing: number;
    damage: number;
}

export function useRoleStatistics({
    sheetId,
    roles
}: UseRoleStatisticsOptions) {

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState<unknown>(null);

    const [statistics, setStatistics] =
        useState<Map<Role, CalculatedStat>>(new Map());

    useEffect(() => {

        let cancelled = false;

        async function fetchStatistics() {

            setLoading(true);
            setError(null);

            try {

                /*
                 * Fetch roster data once
                 */
                const rosterTable = await getRosterTable(sheetId);

                /*
                 * Build:
                 * role -> unique character/war pairs
                 */
                const charactersInRoles =
                    new Map<Role, Set<string>>();

                for (const row of rosterTable) {

                    let uniqueCharacters =
                        charactersInRoles.get(row.role as Role);

                    if (!uniqueCharacters) {
                        uniqueCharacters = new Set<string>();

                        charactersInRoles.set(
                            row.role as Role,
                            uniqueCharacters
                        );
                    }

                    /*
                     * Composite key for deduplication
                     */
                    uniqueCharacters.add(
                        `${row.character}:${row.warid}`
                    );
                }

                const nextStatistics =
                    new Map<Role, CalculatedStat>();

                /*
                 * Process each role
                 */
                for (const role of roles) {

                    const uniqueCharacters =
                        charactersInRoles.get(role);

                    if (!uniqueCharacters) {
                        continue;
                    }

                    /*
                     * Build query params
                     *
                     * NOTE:
                     * This assumes your backend supports
                     * multiple params as OR conditions.
                     *
                     * If not, you'll need a different query format.
                     */
                    const params: QueryParameter[] = [];

                    for (const key of uniqueCharacters) {

                        const [name, warid] =
                            key.split(":");

                        params.push({
                            column: kLeaderboardColumns.character,
                            fn: Qop.eq,
                            value: name
                        });

                        params.push({
                            column: kLeaderboardColumns.warid,
                            fn: Qop.eq,
                            value: Number(warid)
                        });
                    }

                    /*
                     * Fetch leaderboard entries
                     */
                    const leaderboard =
                        await getLeaderboard(sheetId, params);

                    if (leaderboard.length === 0) {
                        continue;
                    }

                    const totals: Totals = {
                        score: 0,
                        kills: 0,
                        deaths: 0,
                        assists: 0,
                        healing: 0,
                        damage: 0
                    };

                    for (const entry of leaderboard) {

                        totals.score += entry.score;
                        totals.kills += entry.kills;
                        totals.deaths += entry.deaths;
                        totals.assists += entry.assists;
                        totals.healing += entry.healing;
                        totals.damage += entry.damage;
                    }

                    const n = leaderboard.length;

                    nextStatistics.set(role, {
                        score: {
                            mean: totals.score / n
                        },

                        kills: {
                            mean: totals.kills / n
                        },

                        deaths: {
                            mean: totals.deaths / n
                        },

                        assists: {
                            mean: totals.assists / n
                        },

                        healing: {
                            mean: totals.healing / n
                        },

                        damage: {
                            mean: totals.damage / n
                        }
                    });
                }

                if (!cancelled) {
                    setStatistics(nextStatistics);
                }

            } catch (err) {

                if (!cancelled) {
                    setError(err);
                }

            } finally {

                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        fetchStatistics();

        return () => {
            cancelled = true;
        };

    }, [roles]);

    return {
        loading,
        error,
        statistics
    };
}
