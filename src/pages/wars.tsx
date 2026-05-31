import { MultiselectDropdown } from "../components/atom/multiselectdropdown";
import { WarListCard, WarListCardSkeleton } from "../components/molecules/warlistcard";
import { useCompanies } from "../hooks2/useCompaniesNew";
import { useWarsHydrated } from "../hooks/composite/useWarsHydrated";
import { Checkbox } from "../components/atom/checkbox";
import type { JSX } from "react";
import { kSheetIds } from "../constants/sheets";
import { useSeason } from "../hooks/base/useSeason";
import { useLocalStorage } from "../hooks/useLocalStorage";

export function Wars(): JSX.Element {
    const { season } = useSeason();

    const { loading, error, wars } = useWarsHydrated(kSheetIds[season]);
    const { companies } = useCompanies(kSheetIds[season]);

    const [savedCompanies, setCompanies] = useLocalStorage<string[]>('companies', []);
    const [showOnlyCompleted, setShowOnlyCompleted] = useLocalStorage<boolean>('onlyCompleted', false);

    if (error) return <div className="text-foreground">Problem loading wars</div>;

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
                    <div className="text-foreground text-xl font-semibold">Wars</div>
                    <div className="grid gap-4 grid-cols-1 w-full mt-4">
                        {loading
                            ? Array.from({ length: 5 }).map((_, i) => (
                                <div key={i}>
                                    <WarListCardSkeleton />
                                </div>
                            ))
                            : sortedWars.map((v, i) => (
                                <div className="transition-all duration-200 hover:-translate-y-1 hover:shadow-lg" key={i}>
                                    <WarListCard war={v} />
                                </div>
                            ))
                        }
                    </div>
                </div>

                {/* Sidebar filters */}
                <div className="flex flex-col gap-2 w-full md:w-48 md:order-2 order-1 text-foreground">
                    <div className="text-foreground text-xl font-semibold">Filters</div>

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
