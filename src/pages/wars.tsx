import Loading from "../components/atom/loading";
import { MultiselectDropdown } from "../components/atom/multiselectdropdown";
import WarListCard from "../components/molecules/warlistcard";
import { useCompanies } from "../hooks2/useCompaniesNew";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useWars } from "../hooks/base/useWars";
import { useEffect } from "react";
import { useWorlds } from "../hooks/base/useWorlds";

const Wars: React.FC = () => {
    const { loading, error, wars } = useWars();

    const { worlds } = useWorlds();
    const { companies } = useCompanies();

    const [savedServers, setServers] = useLocalStorage<string[]>('servers', []);
    const [savedCompanies, setCompanies] = useLocalStorage<string[]>('companies', []);

    useEffect(() => {
        if (worlds.length > 0 && savedServers.length === 0) {
            setServers(worlds.map(v => v.name));
        }
    }, [worlds, setServers]);

    if (loading) return <div className="flex w-full justify-center text-white p-8" ><Loading /></div >;
    if (error) return <div className="text-white">Problem loading wars</div>

    const filteredWars = wars.filter(v => {
        if (savedServers.includes(v.server)) {
            return true;
        } else if (savedCompanies.includes(v.attacker.name) || savedCompanies.includes(v.defender.name)) {
            return true;
        } else if (savedServers.length + savedCompanies.length === 0) {
            return true;
        }
        return false;
    });
    const sortedWars = filteredWars.sort((a, b) => b.date.toMillis() - a.date.toMillis());

    const worldOptions = worlds.map(v => v.name);
    const companyOptions = savedServers.length > 0 ? companies.filter(v => savedServers.includes(v.server)).map(v => v.name) : companies.map(v => v.name);

    return (
        <div className="flex flex-col w-full max-w-5xl mx-auto px-4 mt-4">
            <main className="flex flex-col md:flex-row md:items-start gap-6">
                {/* War cards */}
                <div className="flex-1 md:order-1 order-2">
                    <div className="text-white text-xl font-semibold">Wars</div>
                    <div className="grid gap-4 grid-cols-1 w-full mt-4">
                        {loading
                            ? <span className="text-white"><Loading /></span>
                            : sortedWars.map((v, i) => (
                                <div className="hover:scale-105" key={i}>
                                    <WarListCard war={v} />
                                </div>
                            ))
                        }
                    </div>
                </div>

                {/* Sidebar filters */}
                <div className="flex flex-col gap-2 w-full md:w-48 md:order-2 order-1">
                    <div className="text-white text-xl font-semibold">Filters</div>
                    <MultiselectDropdown
                        name="worlds"
                        options={worldOptions}
                        value={savedServers}
                        onChange={setServers}
                    />
                    <MultiselectDropdown
                        name="companies"
                        options={companyOptions}
                        value={savedCompanies}
                        onChange={setCompanies}
                    />
                </div>
            </main>
        </div>
    );
};

export default Wars;
