// import { useEffect, useState } from "react";
// import type { Company } from "../types/company";
// import { getCompanies } from "../services/companiesservice";
// import type { War } from "../types/war";
// import type { Player } from "../types/player";
// import { getWars } from "../services/wardbservice";
// import { Qop } from "../types/queryparameter";
// import { getPlayers } from "../services/playerservice";
// import { type LeaderboardEntry } from "../types/leaderboard";


// export function useCompanyDetails(companyName: string) {
//     const [company, setCompany] = useState<Company | null>(null);
//     const [wars, setWars] = useState<War[]>([]);
//     const [members, setMembers] = useState<Player[]>([]);
//     const [leaderboards, setLeaderboards] = useState<LeaderboardEntry[]>([]);
//     const [loading, setLoading] = useState<boolean>(true);
//     const [err, setError] = useState<any>(null);
//     useEffect(() => {
//         let cancelled = false;

//         async function fetchAll() {
//             try {
//                 setLoading(true);
//                 const [c, wa, wd, lb, p] = await Promise.all([
//                     getCompanies([companyName]),
//                     getWars([{
//                         column: "D", fn: Qop.Eq, value: companyName
//                     }]),
//                     getWars([{
//                         column: "E", fn: Qop.Eq, value: companyName
//                     }]),
//                     getLeaderboard([{
//                         column: "K", fn: Qop.Eq, value: companyName
//                     }]),
//                     getPlayers([{
//                         column: "F", fn: Qop.Eq, value: companyName
//                     }]),
//                 ]);

//                 const w = wa.concat(wd);
//                 w.sort((a, b) => b.date.getTime() - a.date.getTime());

//                 if (cancelled) return;
//                 if (c.length !== 1) throw new Error('too many companies returned');
//                 setCompany(c[0]);
//                 setWars(w)
//                 setMembers(p);
//                 setLeaderboards(lb.entries);
//             } catch (err) {
//                 if (!cancelled) setError(err);
//             } finally {
//                 if (!cancelled) setLoading(false);
//             }
//         }

//         fetchAll();
//         return () => { cancelled = true; };
//     }, []);

//     return { loading, err, company, wars, members, leaderboards };
// }
