
import { useState } from "react";
import Loading from "../components/atom/loading";
import CompanyListCard from "../components/molecules/companylistcard";
import { useCompanies } from "../hooks2/useCompaniesNew";

const Companies: React.FC = () => {
    const { loading, err, companies } = useCompanies();
    const [search, setSearch] = useState("");

    if (loading) return <div className="flex w-full justify-center text-white p-8" ><Loading /></div >;
    if (err) return <div className="text-white">Problem loading companies</div>

    companies.sort((a, b) => a.faction.toLocaleLowerCase().localeCompare(b.faction.toLocaleLowerCase()))

    return (
        <div className="flex flex-col pt-8 mx-auto gap-4 max-w-3xl">
            <input
                type="text"
                placeholder="Search players..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="p-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 w-full"
            />
            <div className="flex flex-col gap-2 text-white w-full mx-auto">
                {companies.filter(v => v.name.toLocaleLowerCase().includes(search)).map(c => (
                    <CompanyListCard company={c} key={c.name} />
                ))}
            </div>
        </div>
    );


}

export default Companies;
