// import { useEffect, useState } from "react";
// import { getLeaderboard } from "../services/wardbservice";
// import { Qop } from "../types/queryparameter";
// import type { StatSummary } from "../types/leaderboard";
// import { summarize } from "../utils/leaderboard";

// export function usePlayerStats(playerName: string) {
//     const [summary, setSummary] = useState<StatSummary | null>(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState<unknown>(null);

//     useEffect(() => {
//         let cancelled = false;

//         async function fetchData() {
//             try {
//                 setLoading(true);

//                 const qp = { column: 'B', fn: Qop.Eq, value: playerName };
//                 const lb = await getLeaderboard([qp]);
//                 const s = summarize(lb.entries);
//                 if (cancelled) return;
//                 setSummary(s)

//             } catch (err) {
//                 if (!cancelled) setError(err);
//             } finally {
//                 if (!cancelled) setLoading(false);
//             }
//         }

//         fetchData();

//         return () => {
//             cancelled = true; // Prevent state update on unmounted component
//         };
//     }, [playerName]);

//     return { error, loading, summary };
// }
