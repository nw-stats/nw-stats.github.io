// import { useEffect, useState } from "react";
// import { getCompanyFaction } from "../services/wardbservice";
// import type { Faction } from "../types/faction";


// export function useFactions(companyNames: string[]) {
//     const [factions, setFactions] = useState<Map<string, Faction> | null>(null);
//     const [factionLoading, setLoading] = useState(true);
//     const [factionError, setError] = useState<unknown>(null);

//     useEffect(() => {
//         let cancelled = false;

//         async function fetchData() {
//             try {
//                 setLoading(true);
//                 const data = await getCompanyFaction(companyNames);
//                 if (!cancelled) setFactions(data);
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
//     }, [companyNames]);

//     return { factions, factionLoading, factionError };
// }
