
import { useState } from "react";
import Loading from "../components/atom/loading";
import CompanyListCard from "../components/molecules/companylistcard";
import { useCompanies } from "../hooks2/useCompaniesNew";

const Companies: React.FC = () => {
    const [league, setLeague] = useState<string>("M");
    const { loading, err, companies } = useCompanies();
    if (loading) return <div className="flex w-full justify-center text-white p-8" ><Loading /></div >;
    if (err) return <div className="text-white">Problem loading companies</div>

    companies.sort((a, b) => a.faction.toLocaleLowerCase().localeCompare(b.faction.toLocaleLowerCase()))

    return (
        <div className="flex flex-col pt-8 mx-auto gap-4 max-w-3xl">
            <div className="flex max-w-40">
                <button onClick={() => setLeague("M")} className={`text-white ${league === "M" ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-600 hover:bg-gray-700"} rounded-l-lg w-full pt-2 pb-2`}>Main</button>
                <button onClick={() => setLeague("G")} className={`text-white ${league === "G" ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-600 hover:bg-gray-700"} rounded-r-lg w-full pt-2 pb-2`} >G</button>
            </div>
            <div className="flex flex-col gap-2 text-white w-full mx-auto">
                {companies.filter(c => c.tier === league).map(c => (
                    <CompanyListCard company={c} key={c.name} />
                ))}
            </div>
        </div>
    );


}

export default Companies;
