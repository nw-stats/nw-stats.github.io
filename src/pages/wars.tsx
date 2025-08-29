import { MultiselectDropdown } from "../components/atom/multiselectdropdown";
import { WarListCard, WarListCardSkeleton } from "../components/molecules/warlistcard";
import { useCompanies } from "../hooks2/useCompaniesNew";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useWarsHydrated } from "../hooks/composite/useWarsHydrated";
import { Checkbox } from "../components/atom/checkbox";
import type { JSX } from "react";

// export function Wars(): JSX.Element {
//     const { loading, error, wars } = useWarsHydrated();

//     const { companies } = useCompanies();

//     const [savedCompanies, setCompanies] = useLocalStorage<string[]>('companies', []);
//     const [showOnlyCompleted, setShowOnlyCompleted] = useLocalStorage<boolean>('onlyCompleted', false);


//     if (loading) return <div className="flex w-full justify-center text-white p-8" ><Loading /></div >;
//     if (error) return <div className="text-white">Problem loading wars</div>

//     const filteredWars = wars.filter(v => {
//         if (savedCompanies.length === 0) {
//             return true;
//         } else {
//             return (savedCompanies.includes(v.attacker.name) || savedCompanies.includes(v.defender.name));
//         }
//     });
//     const sortedWars = filteredWars.sort((a, b) => b.date.toMillis() - a.date.toMillis());

//     const companyOptions = companies.map(v => v.name);

//     return (
//         <div className="flex flex-col w-full max-w-5xl mx-auto px-4 mt-4">
//             <main className="flex flex-col md:flex-row md:items-start gap-6">
//                 {/* War cards */}
//                 <div className="flex-1 md:order-1 order-2">
//                     <div className="text-white text-xl font-semibold">Wars</div>
//                     <div className="grid gap-4 grid-cols-1 w-full mt-4">
//                         {loading
//                             ? <span className="text-white"><Loading /></span>
//                             : sortedWars.map((v, i) => (
//                                 <div className="hover:scale-105" key={i}>
//                                     <WarListCard war={v} />
//                                 </div>
//                             ))
//                         }
//                     </div>
//                 </div>

//                 {/* Sidebar filters */}
//                 <div className="flex flex-col gap-2 w-full md:w-48 md:order-2 order-1">
//                     <div className="text-white text-xl font-semibold">Filters</div>

//                     <MultiselectDropdown
//                         name="companies"
//                         options={companyOptions}
//                         value={savedCompanies}
//                         onChange={setCompanies}
//                     />
//                     <Checkbox label={"Only show past wars with stats"} checked={showOnlyCompleted} onChecked={setShowOnlyCompleted} />
//                 </div>
//             </main>
//         </div>
//     );
// };

export function Wars(): JSX.Element {
    const { loading, error, wars } = useWarsHydrated();
    const { companies } = useCompanies();

    const [savedCompanies, setCompanies] = useLocalStorage<string[]>('companies', []);
    const [showOnlyCompleted, setShowOnlyCompleted] = useLocalStorage<boolean>('onlyCompleted', false);

    if (error) return <div className="text-white">Problem loading wars</div>;

    const filteredWars = wars.filter(v => {
        if (savedCompanies.length === 0) {
            return true;
        } else {
            return (
                savedCompanies.includes(v.attacker.name) ||
                savedCompanies.includes(v.defender.name)
            );
        }
    });

    const sortedWars = filteredWars.filter(v => v.status === 'complete' || !showOnlyCompleted).sort((a, b) => b.date.toMillis() - a.date.toMillis());
    const companyOptions = companies.map(v => v.name);

    return (
        <div className="flex flex-col w-full max-w-5xl mx-auto px-4 mt-4">
            <main className="flex flex-col md:flex-row md:items-start gap-6">
                {/* War cards */}
                <div className="flex-1 md:order-1 order-2">
                    <div className="text-white text-xl font-semibold">Wars</div>
                    <div className="grid gap-4 grid-cols-1 w-full mt-4">
                        {loading
                            ? Array.from({ length: 5 }).map((_, i) => (
                                <div key={i}>
                                    <WarListCardSkeleton />
                                </div>
                            ))
                            : sortedWars.map((v, i) => (
                                <div className="hover:scale-105" key={i}>
                                    <WarListCard war={v} />
                                </div>
                            ))
                        }
                    </div>
                </div>

                {/* Sidebar filters */}
                <div className="flex flex-col gap-2 w-full md:w-48 md:order-2 order-1 text-white">
                    <div className="text-white text-xl font-semibold">Filters</div>

                    <MultiselectDropdown
                        name="companies"
                        options={companyOptions}
                        value={savedCompanies}
                        onChange={setCompanies}
                    />
                    <Checkbox
                        label="Only show past wars with stats"
                        checked={showOnlyCompleted}
                        onChecked={setShowOnlyCompleted}
                    />
                </div>
            </main>
        </div>
    );
}
