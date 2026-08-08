
import { useState } from "react";
import Loading from "../components/atom/loading";

import { useCompanies } from "../hooks/useCompanies";
import { CompanyListCard } from "../components/molecules/companylistcard";
import { useSeason } from "../hooks/base/useSeason";
import { kSheetIds } from "../constants/sheets";

const Companies: React.FC = () => {
    const { season } = useSeason();
    const { loading, error, companies } = useCompanies(kSheetIds[season]);
    const [search, setSearch] = useState("");

    if (loading) return <div className="flex w-full justify-center text-foreground p-8" ><Loading /></div >;
    if (error) return <div className="text-foreground">Problem loading companies</div>

    companies.sort((a, b) => a.faction.toLocaleLowerCase().localeCompare(b.faction.toLocaleLowerCase()))

    return (
        <div className="flex flex-col pt-8 mx-auto gap-4 max-w-3xl">
            <input
                type="text"
                placeholder="Search companies..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="p-2 rounded-lg bg-surface-1 text-foreground placeholder-gray-400 w-full"
            />
            <div className="flex flex-col gap-2 text-foreground w-full mx-auto">
                {companies.filter(v => v.name.toLocaleLowerCase().includes(search)).map((c, i) => (
                    <CompanyListCard company={c} key={i} />
                ))}
            </div>
        </div>
    );


}

export default Companies;
