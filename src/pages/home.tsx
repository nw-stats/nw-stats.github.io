import { useEffect } from "react";
import Loading from "../components/atom/loading";
import { MultiselectDropdown } from "../components/atom/multiselectdropdown";
import PlaceholderTile from "../components/molecules/placeholdertile";
import WarListCard from "../components/molecules/warlistcard";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useWars } from "../hooks/useWars";
import { useWorlds } from "../hooks/useWorlds";
import { useCompanies } from "../hooks2/useCompaniesNew";
import { currentHour, sortByDateThenTime } from "../utils/time";
// import Carousel from "../components/molecules/carousel";

const Home: React.FC = () => {
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
    if (error) return <div className="flex w-full justify-center text-red-500">Error loading wars </div>;

    const rightNow = currentHour();
    const serverWars = wars.filter(v => {
        if (savedServers.includes(v.server)) {
            return true;
        } else if (savedCompanies.includes(v.attacker.name) || savedCompanies.includes(v.defender.name)) {
            return true;
        } else if (savedServers.length + savedCompanies.length === 0) {
            return true;
        }
        return false;
    });

    const pastWars = serverWars.filter(item => item.date.toMillis() < rightNow.toMillis());
    const Upcoming = serverWars.filter(item => item.date.toMillis() >= rightNow.toMillis()).sort((a, b) => sortByDateThenTime(a.date, b.date));

    const worldOptions = worlds.map(v => v.name);
    const companyOptions = savedServers.length > 0 ? companies.filter(v => savedServers.includes(v.server)).map(v => v.name) : companies.map(v => v.name);

    return (
        <div className="flex flex-col w-full max-w-5xl mx-auto px-4 mt-4">
            <main className="flex flex-col md:flex-row md:items-start gap-6">
                {/* War cards */}
                <div className="flex-1 md:order-1 order-2">
                    <div className="text-white text-xl font-semibold">Upcoming Wars</div>
                    <div className="grid gap-4 grid-cols-1 w-full mt-4">
                        {loading
                            ? <div className="flex items-center justify-center text-white bg-gray-800 rounded-lg w-full h-full min-h-[104px]"><Loading /></div>
                            : Upcoming.length === 0
                                ? <PlaceholderTile />
                                : Upcoming.map((v, i) => <WarListCard war={v} key={i} />)
                        }
                    </div>

                    <div className="text-white text-xl font-semibold mt-8">Past Wars</div>
                    <div className="grid gap-4 grid-cols-1 w-full mt-4">
                        {loading
                            ? <span className="text-white"><Loading /></span>
                            : pastWars.map((v, i) => (
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
export default Home;
