import type { GroupPerformance, LeaderboardEntry, StatDiff, StatTotals } from "../types/leaderboard";
import type { GroupKey, Roster } from "../types/roster";
import { isQpdsGroup } from "./roster";

export function getGroupDetails(leaderboard: LeaderboardEntry[], rosters: Map<string, Roster>): Map<string, Map<GroupKey, GroupPerformance>> {
    const performance = new Map<string, Map<GroupKey, GroupPerformance>>();

    for (const [company, roster] of rosters) {
        let companyPerformance = performance.get(company);
        if (!companyPerformance) {
            companyPerformance = new Map<GroupKey, GroupPerformance>();
            performance.set(company, companyPerformance);
        }

        for (const [gk, players] of roster.groups) {
            let groupPerformance = companyPerformance.get(gk);
            if (!groupPerformance) {
                groupPerformance = { stats: [] }
                companyPerformance.set(gk, groupPerformance);
            }

            for (const entry of leaderboard) {
                for (const player of players) {
                    if (player.name === entry.character) {
                        entry.role = player.role;
                        groupPerformance.stats.push({ ...entry, role: player.role, qpds: Boolean(player.qpds) });
                    }
                }
            }
        }
    }

    return performance;
}

export function getGroupSummaries(groupDetails: Map<string, Map<GroupKey, GroupPerformance>>) {
    const summaires = new Map<string, Map<GroupKey, StatTotals>>();

    for (const [company, details] of groupDetails) {
        let summary = summaires.get(company);
        if (!summary) {
            summary = new Map<GroupKey, StatTotals>();
            summaires.set(company, summary);
        }

        for (const [gk, entries] of details) {
            let group = summary.get(gk);
            if (!group) {
                group = {
                    name: String(gk),
                    score: 0,
                    kills: 0,
                    deaths: 0,
                    assists: 0,
                    healing: 0,
                    damage: 0,
                    count: 0,
                    kpar: 0,
                }
                summary.set(gk, group);
            }

            for (const entry of entries.stats) {
                group.score += entry.score;
                group.kills += entry.kills;
                group.deaths += entry.deaths;
                group.assists += entry.assists;
                group.healing += entry.healing;
                group.damage += entry.damage;
                group.kpar += entry.kpar;
            }
            if (entries.stats.length > 0) {
                group.kpar /= entries.stats.length;
            }
        }
    }

    return summaires;
}

export function companyGroupSummary(groups: Map<GroupKey, GroupPerformance>): Map<GroupKey, StatTotals> {
    const summary = new Map<GroupKey, StatTotals>();
    for (const [gk, entries] of groups) {
        let group = summary.get(gk);
        if (!group) {
            group = {
                name: String(gk),
                score: 0,
                kills: 0,
                deaths: 0,
                assists: 0,
                healing: 0,
                damage: 0,
                count: 0,
                kpar: 0,
            }
            summary.set(gk, group);
        }

        for (const entry of entries.stats) {
            group.score += entry.score;
            group.kills += entry.kills;
            group.deaths += entry.deaths;
            group.assists += entry.assists;
            group.healing += entry.healing;
            group.damage += entry.damage;
            group.kpar += entry.kpar;
        }
        if (entries.stats.length > 0) {
            group.kpar /= entries.stats.length;
        }
    }
    return summary;
}

export function getGroupDiff(attackerSummary: Map<GroupKey, StatTotals>, defenderSummary: Map<GroupKey, StatTotals>): Map<GroupKey, StatDiff> {
    const diff = new Map<GroupKey, StatDiff>();
    //{ name: 'diff', score: 0, killS: 0, deths: 0, assists: 0, healing: 0, damage: 0 };
    for (const gk of attackerSummary.keys()) {
        let atk = attackerSummary.get(gk);
        let def = defenderSummary.get(gk);

        if (!atk) {
            atk = { name: String(gk), score: 0, kills: 0, deaths: 0, assists: 0, healing: 0, damage: 0, count: 0, kpar: 0 };
        }
        if (!def) {
            def = { name: String(gk), score: 0, kills: 0, deaths: 0, assists: 0, healing: 0, damage: 0, count: 0, kpar: 0 };
        }
    }

    return diff;
}

export function splitRoster(roster: Map<GroupKey, GroupPerformance>): Map<GroupKey, GroupPerformance> {
    const splitRoster = new Map<GroupKey, GroupPerformance>();
    for (const [gk, group] of roster) {
        let splitGroup = splitRoster.get(gk);
        if (!splitGroup) {
            splitGroup = { stats: [] };
            splitRoster.set(gk, splitGroup);
        }

        for (const entry of group.stats) {
            if (!isQpdsGroup(gk) && entry.qpds) {
                continue;
            }

            splitGroup.stats.push(entry);
        }
    }

    return splitRoster;
}

export function joinedRoster(roster: Map<GroupKey, GroupPerformance>): Map<GroupKey, GroupPerformance> {
    const joinedRoster = new Map<GroupKey, GroupPerformance>();
    for (const [gk, group] of roster) {
        if (isQpdsGroup(gk)) continue;
        joinedRoster.set(gk, group);
    }
    return joinedRoster;
}

export function isNumberGroup(gk: GroupKey): boolean {
    return typeof gk === 'number';
}
