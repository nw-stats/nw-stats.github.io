// import { useEffect, useState } from "react";
// import { createPlayerDetails, getLeaderboard, getRosters, getWars } from "../services/wardbservice";
// import { type QueryOperator } from "../types/queryparameter";
// import { type QueryParameter } from "../types/queryparameter";
// import type { PlayerDetails } from "../types/playerdetails";
// import { getPlayer } from "../services/playerservice";

// export function usePlayerDetails(playerName: string) {
//     const [playerDetails, setPlayerDetails] = useState<PlayerDetails | null>(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState<unknown>(null);

//     useEffect(() => {
//         let cancelled = false;

//         async function fetchData() {
//             try {
//                 setLoading(true);
//                 const lb = await getLeaderboard([{ column: "B", fn: "=" as unknown as QueryOperator, value: playerName }]);
//                 const warqp = lb.entries.map(item => {
//                     return {
//                         column: "A", fn: "=" as unknown as QueryOperator, value: item.warid
//                     };
//                 });
//                 const rqp: QueryParameter[] = lb.entries.map(item => {
//                     return {
//                         column: "B", fn: "=" as unknown as QueryOperator, value: item.warid
//                     };
//                 })
//                 rqp.push({ column: "A", fn: "=" as unknown as QueryOperator, value: playerName });
//                 const [x, w, r] = await Promise.all([
//                     getPlayer(playerName),
//                     getWars(warqp),
//                     getRosters(rqp)
//                 ]);

//                 const p = createPlayerDetails(x, lb, r, w);

//                 if (cancelled) return;
//                 setPlayerDetails(p)
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

//     return { error, loading, playerDetails };
// }
