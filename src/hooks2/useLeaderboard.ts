// import { useEffect, useState } from "react";
// import type { Leaderboard } from "../types/leaderboard";
// import { getLeaderboard } from "../services/wardbservice";


// export function useLeaderboard(warId: number) {
//     const [leaderboard, setLeaderboard] = useState<Leaderboard | null>(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState<unknown>(null);

//     useEffect(() => {
//         let cancelled = false;

//         async function fetchData() {
//             try {
//                 setLoading(true);
//                 const data = await getLeaderboard([{ value: warId, column: "C", fn: "=" }]);
//                 if (!cancelled) setLeaderboard(data);
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
//     }, [warId]);

//     return { leaderboard, loading, error };
// }
