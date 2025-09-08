import { MultiselectDropdown } from "../components/atom/multiselectdropdown";
import PlaceholderTile from "../components/molecules/placeholdertile";
import { useLocalStorage } from "../hooks/useLocalStorage";

import { currentHour, sortByDateThenTime } from "../utils/time";
import { Checkbox } from "../components/atom/checkbox";
import { WarListCard, WarListCardSkeleton } from "../components/molecules/warlistcard";
import { useHydratedWars } from "../hooks/wars/useHydratedWars";
import { useHydratedCompanies } from "../hooks/companies/useHydratedCompanies";
import { useHydratedWorlds } from "../hooks/worlds/useHydratedWorlds";




const Home: React.FC = () => {
    const {
        data: wars,
        isLoading: isisLoadingWars,
        isError: isErrorWars } = useHydratedWars();
    const {
        data: worlds,
        isLoading: isisLoadingWorlds,
        isError: isErrorWorlds } = useHydratedWorlds();
    const {
        data: companies,
        isLoading: isisLoadingCompanies,
        isError: isErrorCompanies } = useHydratedCompanies();

    const isError = isErrorWars || isErrorWorlds || isErrorCompanies;
    const isisLoading = isisLoadingWars || isisLoadingWorlds || isisLoadingCompanies;

    const [savedCompanies, setCompanies] = useLocalStorage<string[]>('companies', []);
    const [showOnlyCompleted, setShowOnlyCompleted] = useLocalStorage<boolean>('onlyCompleted', false);

    if (isError || !wars || !companies || !worlds) return <div className="flex w-full justify-center text-red-500">Error isLoading wars</div>;

    const rightNow = currentHour();
    const serverWars = wars.filter(v => {
        if (savedCompanies.length === 0) {
            return true;
        } else {
            return (
                savedCompanies.includes(v.attacker.name) ||
                savedCompanies.includes(v.defender.name)
            );
        }
    });

    const pastWars = serverWars
        .filter(v => v.status === 'complete' || !showOnlyCompleted)
        .filter(item => item.date.toMillis() < rightNow.toMillis())
        .sort((a, b) => b.date.toMillis() - a.date.toMillis());

    const Upcoming = serverWars
        .filter(item => item.date.toMillis() >= rightNow.toMillis())
        .sort((a, b) => sortByDateThenTime(a.date, b.date));

    let worldOptions: string[] = [];
    if (savedCompanies.length > 0) {
        for (const name of savedCompanies) {
            const company = companies.find(v => v.name === name);
            if (company) {
                worldOptions.push(company.server);
            }
        }
    } else {
        worldOptions = worlds.map(v => v.name);
    }
    const companyOptions = companies.map(v => v.name);

    return (
        <div className="flex flex-col w-full max-w-5xl mx-auto px-4 mt-4">
            <main className="flex flex-col md:flex-row md:items-start gap-6">
                {/* War cards */}
                <div className="flex-1 md:order-1 order-2">
                    {/* Upcoming */}
                    <div className="text-white text-xl font-semibold">Upcoming Wars</div>
                    <div className="grid gap-4 grid-cols-1 w-full mt-4">
                        {isisLoading
                            ? <WarListCardSkeleton />
                            : Upcoming.length === 0
                                ? <PlaceholderTile />
                                : Upcoming.map((v, i) => (
                                    <div className="hover:scale-105" key={i}>
                                        <WarListCard war={v} />
                                    </div>
                                ))
                        }
                    </div>

                    {/* Past */}
                    <div className="text-white text-xl font-semibold mt-8">Past Wars</div>
                    <div className="grid gap-4 grid-cols-1 w-full mt-4">
                        {isisLoading
                            ? Array.from({ length: 5 }).map((_, i) => (
                                <div key={i}>
                                    <WarListCardSkeleton />
                                </div>
                            ))
                            : pastWars.map((v, i) => (
                                <div className="hover:scale-105" key={i}>
                                    <WarListCard war={v} />
                                </div>
                            ))
                        }
                    </div>
                </div>

                {/* Sidebar filters */}
                <div className="text-white flex flex-col gap-2 w-full md:w-48 md:order-2 order-1">
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
};

export default Home;
