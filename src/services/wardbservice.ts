import { constructQuery } from "../utils/querybuilder";
import { combineDateAndTime, convertFromGoogleSheetsDateString } from "../utils/time";
import { fetchTableFromGoogleSheets } from "./googlesheets";
import { type Ordering, type QueryParameter } from "../types/queryparameter";
import { kSheetId } from "../constants/sheets";
import { kWarColumns, kWarTable } from "../mapping/warmap";
import { convertInt, convertString } from "../utils/sheetconvert";
import type { WarRaw } from "../types/rawtypes/warraw";

// //const kSheetId = "14byZyCAX_N_AA-y_1tv4CLtgTCaOB-Zq8QbOHmavE6Y";

// const kIdxCompanyName = 0;
// const kIdxFactiion = 1;
// export type OrderingOperator = "asc" | "desc";
// export interface Ordering {
//     column: string;
//     direction: OrderingOperator;
// }
// export async function getLeaderboard(params?: QueryParameter[], limit?: number, order?: Ordering): Promise<Leaderboard> {
//     const conditions = params ? ` WHERE ${makeConditions(params)}` : ''
//     const limitStr = limit ? ` LIMIT ${limit}` : '';
//     const orderStr = order ? ` ORDER BY ${order.column} ${order.direction.toUpperCase()}` : '';
//     const query = `SELECT C, D, B, E, F, G, H, I, J, K${conditions}${orderStr}${limitStr}`;
//     const data = await fetchTableFromGoogleSheets(kSheetId, 'leaderboards', query);

//     const leaderboard: Leaderboard = { entries: [] };

//     for (const row of data) {
//         const entry: LeaderboardEntry = {
//             warid: Number(row[0] ?? 0),
//             name: String(row[2] ?? ""),
//             score: Number(row[3] ?? 0),
//             kills: Number(row[4] ?? 0),
//             deaths: Number(row[5] ?? 0),
//             assists: Number(row[6] ?? 0),
//             healing: Number(row[7] ?? 0),
//             damage: Number(row[8] ?? 0),
//             company: String(row[9] ?? ""),
//         };
//         leaderboard.entries.push(entry);
//     }

//     return leaderboard
// }

// export async function getCompanyFaction(companyNames: string[]): Promise<Map<string, Faction>> {
//     const companyFactions = new Map();
//     if (companyNames.length === 0) { return companyFactions; }
//     const condition = joinCondition(companyNames, 'OR', 'A');
//     const query = `SELECT A, B WHERE(${condition})`;
//     const data = await fetchTableFromGoogleSheets(kSheetId, 'companies', query);

//     for (const row of data) {
//         const name = row[kIdxCompanyName];
//         const faction = row[kIdxFactiion];
//         companyFactions.set(name, faction);
//     }

//     return companyFactions;
// }

// export async function getRosters(params: QueryParameter[], limit?: number, order?: Ordering): Promise<Map<number, Map<string, Roster>>> {
//     const conditions = params ? ` WHERE ${makeConditions(params)}` : ''
//     const limitStr = limit ? ` LIMIT ${limit}` : '';
//     const orderStr = order ? ` ORDER BY ${order.column} ${order.direction.toUpperCase()}` : '';
//     const query = `SELECT A, B, C, D, E${conditions}${orderStr}${limitStr}`;
//     const data = await fetchTableFromGoogleSheets(kSheetId, 'groups', query);

//     const rosters = new Map<number, Map<string, Roster>>();
//     for (const row of data) {
//         const name = row[0] as string;
//         const warid = row[1] as number;
//         const role = row[4] as Role;
//         const group = row[2] as number;
//         const company = row[3] as string;

//         let warRoster = rosters.get(warid);
//         if (!warRoster) {
//             warRoster = new Map<string, Roster>();
//             rosters.set(warid, warRoster);
//         }

//         let roster = warRoster.get(company);
//         if (!roster) {
//             roster = { warid, groups: new Map<number, Group>() };
//             warRoster.set(company, roster);
//         }

//         let rosterGroup = roster.groups.get(group);
//         if (!rosterGroup) {
//             rosterGroup = { players: [] };
//             roster.groups.set(group, rosterGroup);
//         }
//         rosterGroup.players.push({ name, role });
//     }

//     return rosters;
// }

export async function getWars(params?: QueryParameter[], limit?: number, order?: Ordering): Promise<WarRaw[]> {
    const query = constructQuery([
        kWarColumns.id,
        kWarColumns.date,
        kWarColumns.time,
        kWarColumns.server,
        kWarColumns.territory,
        kWarColumns.attacker,
        kWarColumns.defender,
        kWarColumns.winnner,
        kWarColumns.pointA,
        kWarColumns.pointB,
        kWarColumns.pointC,
        kWarColumns.fort,
        kWarColumns.duration,
        kWarColumns.show,
        kWarColumns.status,
        kWarColumns.tz,
    ], params, order, limit);
    const data = await fetchTableFromGoogleSheets(kSheetId, 'wars', query);
    const wars: WarRaw[] = [];
    for (const row of data) {
        const id = convertInt(row[kWarTable.id]);
        const date = convertFromGoogleSheetsDateString(row[kWarTable.date] as string) || new Date();
        const time = convertFromGoogleSheetsDateString(row[kWarTable.time] as string) || new Date();
        const tz = convertString(row[kWarTable.tz]);
        const dateTime = combineDateAndTime(date, time, tz);
        const server = convertString(row[kWarTable.server]);
        const map = convertString(row[kWarTable.territory]);
        const attacker = convertString(row[kWarTable.attacker]);
        const defender = convertString(row[kWarTable.defender]);
        const winner = convertString(row[kWarTable.winnner]);
        const captures = {
            pointA: convertInt(row[kWarTable.pointA]),
            pointB: convertInt(row[kWarTable.pointB]),
            pointC: convertInt(row[kWarTable.pointC]),
            fort: convertInt(row[kWarTable.fort]),
        };
        const duration = convertInt(row[kWarTable.duration]);
        wars.push({ id, date: dateTime, server, map, attacker, defender, winner, captures, duration });
    }
    return wars;
}

// export async function getWar(warId: number): Promise<War | null> {
//     const qp = {
//         column: "A",
//         fn: Qop.eq,
//         value: warId
//     }
//     const w = await getWars([qp]);
//     if (w.length >= 1) {
//         return w[0];
//     }
//     return null;
// }

// export async function getCompanies(): Promise<Company[]> {
//     const query = `SELECT D, E`;
//     const data = await fetchTableFromGoogleSheets(kSheetId, 'wars', query);

//     const companiesSet = new Set<string>();
//     for (const row of data) {
//         companiesSet.add(row[0] as string);
//         companiesSet.add(row[1] as string);
//     }

//     const companies = Array.from(companiesSet);
//     const factions = await getCompanyFaction(companies);

//     const c: Company[] = [];
//     for (const company of companies) {
//         let f = factions.get(company);
//         if (!f) { f = 'Gray' };
//         c.push({
//             id: 0,
//             name: company,
//             shorthand: '',
//             server: '',
//             governor: '',
//             captains: [],
//             shotcaller: '',
//             tier: '',
//             icon: '',
//             faction: f,

//         });
//     }

//     return c.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
// }

// export function splitIntoGroups(leaderboard: Leaderboard, rosters: Map<string, Roster>): Map<string, Map<number, GroupPerformance>> {
//     const warGroupStats = new Map<string, Map<number, GroupPerformance>>();

//     for (const [company, roster] of rosters) {
//         let companyGroupStats = warGroupStats.get(company);
//         if (!companyGroupStats) {
//             companyGroupStats = new Map<number, GroupPerformance>();
//             warGroupStats.set(company, companyGroupStats);
//         }

//         for (const [n, group] of roster.groups) {
//             let groupPerformance = companyGroupStats.get(n);
//             if (!groupPerformance) {
//                 groupPerformance = { group: group, stats: [] };
//                 companyGroupStats.set(n, groupPerformance);
//             }
//             for (const player of group.players) {
//                 for (const entry of leaderboard.entries) {
//                     if (entry.name === player.name) {
//                         groupPerformance.stats.push(entry);
//                     }
//                 }
//             }
//         }
//     }

//     return warGroupStats;
// }

// export function summarizeLeaderboard(leaderboard: Leaderboard): Map<string, StatSummary> {
//     const summaries = new Map<string, StatSummary>();

//     for (const entry of leaderboard.entries) {
//         let summary = summaries.get(entry.company);
//         if (!summary) {
//             summary = {
//                 name: entry.company,
//                 count: 0,
//                 score: 0,
//                 kills: 0,
//                 deaths: 0,
//                 assists: 0,
//                 healing: 0,
//                 damage: 0,
//             };
//             summaries.set(entry.company, summary);
//         }

//         summary.score += entry.score;
//         summary.kills += entry.kills;
//         summary.deaths += entry.deaths;
//         summary.assists += entry.assists;
//         summary.healing += entry.healing;
//         summary.damage += entry.damage;
//     }

//     return summaries;
// }

// export function summarizeGroups(leaderboard: Leaderboard, rosters: Map<string, Roster>): Map<string, Map<number, StatSummary>> {
//     const companyGroupSummaries = new Map();

//     for (const [company, roster] of rosters) {
//         let groupSummary = companyGroupSummaries.get(company);
//         if (!groupSummary) {
//             groupSummary = new Map<number, StatSummary>();
//             companyGroupSummaries.set(company, groupSummary);
//         }
//         for (const entry of leaderboard.entries) {
//             for (const [n, group] of roster.groups) {
//                 if (group.players.some(player => player.name === entry.name)) {
//                     let summary = groupSummary.get(n);
//                     if (!summary) {
//                         summary = { name: `${n} `, score: 0, kills: 0, deaths: 0, assists: 0, healing: 0, damage: 0 };
//                         groupSummary.set(n, summary);
//                     }
//                     summary.score += entry.score;
//                     summary.kills += entry.kills;
//                     summary.deaths += entry.deaths;
//                     summary.assists += entry.assists;
//                     summary.healing += entry.healing;
//                     summary.damage += entry.damage;
//                 }
//             }
//         }
//     }

//     return companyGroupSummaries;
// }

// export function createPlayerDetails(
//     player: Player | null,
//     leaderboard: Leaderboard,
//     rosters: Map<number, Map<string, Roster>>,
//     wars: War[]
// ): PlayerDetails {

//     const usablePlayer = player || {
//         id: -1,
//         name: 'Scot Lane',
//         server: 'San Francisco',
//         role: '',
//         faction: 'Gray',
//         company: 'AGS'
//     }

//     const pd: PlayerDetails = {
//         player: usablePlayer,
//         stats: []
//     };

//     for (const entry of leaderboard.entries) {
//         const warRoster = rosters.get(entry.warid);
//         if (!warRoster) continue;
//         const companyRoster = warRoster.get(entry.company);
//         if (!companyRoster) continue;
//         let role = '';
//         let attacker = '';
//         let defender = '';
//         let isWinner = false;
//         for (const [_, group] of companyRoster.groups) {
//             for (const player of group.players) {
//                 if (player.name === entry.name) {
//                     role = player.role;
//                 }
//             }
//         }

//         for (const war of wars) {
//             if (war.id === entry.warid) {
//                 attacker = war.attacker
//                 defender = war.defender
//                 isWinner = entry.company === war.winner;
//                 break;
//             }
//         }

//         pd.stats.push({ ...entry, attacker, defender, role, isWinner });
//     }

//     return pd;
// }
