// import { useEffect, useState } from "react";
// import type { Company } from "../types/company";
// import { getCompanies } from "../services/wardbservice";


// export function useCompanies() {
//     const [companies, setCompanies] = useState<Company[]>([]);
//     const [loading, setLoading] = useState<boolean>(true);
//     const [err, setError] = useState<any>(null);

//     useEffect(() => {
//         let cancelled = false;

//         async function fetchAll() {
//             try {
//                 setLoading(true);
//                 const c = await getCompanies();
//                 if (cancelled) return;
//                 setCompanies(c);

//             } catch (err) {
//                 if (!cancelled) setError(err);
//             } finally {
//                 if (!cancelled) setLoading(false);
//             }
//         }

//         fetchAll();
//         return () => { cancelled = true; };
//     }, []);

//     return { loading, err, companies };
// }
