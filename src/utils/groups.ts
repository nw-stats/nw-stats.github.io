import type { GroupPerformance, Leaderboard, StatTotals, WarPressure } from "../types/leaderboard";
import type { GroupKey, Roster } from "../types/roster";
import { calculatePressure } from "../types/pressure";
import { isQpdsGroup } from "../types/role";

export function getGroupDetails(leaderboard: Leaderboard, rosters: Map<string, Roster>): Map<string, Map<GroupKey, GroupPerformance>> {
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
                        groupPerformance.stats.push({ ...entry, qpds: Boolean(player.qpds) });
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

export function getGroupDiff(attackerSummary: Map<GroupKey, StatTotals>, defenderSummary: Map<GroupKey, StatTotals>): Map<GroupKey, StatTotals> {
    const diff = new Map<GroupKey, StatTotals>();
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

export function getGroupsDiff(attacker: Map<GroupKey, GroupPerformance>, defender: Map<GroupKey, GroupPerformance>): Map<GroupKey, StatTotals> {
    const diff: Map<GroupKey, StatTotals> = new Map();
    const toSummarize: Map<string, Map<GroupKey, GroupPerformance>> = new Map();
    toSummarize.set("atk", attacker);
    toSummarize.set("def", defender);
    const summaries = getGroupSummaries(toSummarize)
    const atkSummary = summaries.get("atk");
    const defSummary = summaries.get("def");
    if (!atkSummary || !defSummary) return diff;

    for (const k of atkSummary.keys()) {
        const a = atkSummary.get(k);
        const d = defSummary.get(k);
        if (!a || !d) continue;
        diff.set(k, ({
            name: '',
            score: d.score - a.score,
            kills: d.kills - a.kills,
            deaths: d.kills - a.deaths,
            assists: d.kills - a.assists,
            healing: d.kills - a.healing,
            damage: d.kills - a.damage,
            count: 1,
            kpar: d.kpar - a.kpar,
        }));
    }
    return diff;
}

export function getPressure(attacker: Map<GroupKey, GroupPerformance>, defender: Map<GroupKey, GroupPerformance>): WarPressure {
    const pressure: WarPressure = {
        maxPressure: 0,
        attackPressure: new Map(),
        defendPressure: new Map(),
    };
    const toSummarize: Map<string, Map<GroupKey, GroupPerformance>> = new Map();
    toSummarize.set("atk", attacker);
    toSummarize.set("def", defender);
    const summaries = getGroupSummaries(toSummarize)
    const atkSummary = summaries.get("atk");
    const defSummary = summaries.get("def");
    if (!atkSummary || !defSummary) return pressure;

    const pressuresDiff: number[] = [];
    for (const k of atkSummary.keys()) {
        const a = atkSummary.get(k);
        const d = defSummary.get(k);
        if (!a || !d) continue;

        const ap = calculatePressure(a.kills, a.deaths, a.assists);
        const dp = calculatePressure(d.kills, d.deaths, d.assists);

        pressure.attackPressure.set(k, ap);
        pressure.defendPressure.set(k, dp);
        pressuresDiff.push(ap - dp);
    }
    pressure.maxPressure = Math.max(...(pressuresDiff.map(v => Math.abs(v))));
    return pressure;
}
