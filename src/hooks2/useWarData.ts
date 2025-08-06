// import { useEffect, useState } from "react";
// import type { GroupPerformance, Leaderboard, StatSummary } from "../types/leaderboard";
// import type { Faction } from "../types/faction";
// import { getCompanyFaction, getLeaderboard, getRosters, getWar, splitIntoGroups, summarizeGroups, summarizeLeaderboard } from "../services/wardbservice";
// import type { Roster } from "../types/roster";
// import type { War } from "../types/war";

// export function useWarData(warId: number) {
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState<unknown>(null);
//     const [leaderboard, setLeaderboard] = useState<Leaderboard | null>(null);
//     const [factions, setFactions] = useState<Map<string, Faction>>(new Map());
//     const [summary, setSummary] = useState<Map<string, StatSummary>>(new Map());
//     const [rosters, setRosters] = useState<Map<string, Roster>>(new Map());
//     const [groupSummary, setGroupSummary] = useState<Map<string, Map<number, StatSummary>>>(new Map());
//     const [war, SetWar] = useState<War | null>(null);
//     const [groupDetails, setGroupDetails] = useState<Map<string, Map<number, GroupPerformance>>>(new Map());

//     useEffect(() => {
//         let cancelled = false;
//         async function fetchAll() {
//             try {
//                 setLoading(true);
//                 const lb = await getLeaderboard([{ column: "C", fn: "=", value: warId }]);
//                 if (cancelled) return;

//                 const sum = summarizeLeaderboard(lb);
//                 const companies = [...sum.keys()];
//                 const f = await getCompanyFaction(companies);
//                 const g = await getRosters([{ column: "B", fn: "=", value: warId }]);
//                 if (!g.has(warId)) {
//                     throw new Error(`Failed to get roster for ${warId}`)
//                 }
//                 const gd = await splitIntoGroups(lb, g.get(warId)!);
//                 const gs = summarizeGroups(lb, g.get(warId)!);
//                 const w = await getWar(warId);
//                 if (cancelled) return;

//                 setLeaderboard(lb);
//                 setSummary(sum);
//                 setFactions(f);
//                 setRosters(g.get(warId)!);
//                 setGroupSummary(gs);
//                 SetWar(w);
//                 setGroupDetails(gd);
//             } catch (err) {
//                 if (!cancelled) setError(err);
//             } finally {
//                 if (!cancelled) setLoading(false);
//             }
//         }

//         fetchAll();
//         return () => { cancelled = true; };
//     }, [warId]);

//     return { loading, error, war, leaderboard, factions, summary, groupSummary, groupDetails, roster: rosters };
// }
