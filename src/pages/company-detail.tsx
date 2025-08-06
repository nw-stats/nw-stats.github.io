
import { useParams } from "react-router-dom";

import NotFound from "./notfound";

import { useCompanyDetails } from "../hooks/useCompanyDetails";
import Loading from "../components/atom/loading";
import CompanyDetailCard from "../components/molecules/companydetailcard";
import CompanyMembersTable from "../components/organisms/companymemberstable";
import CompanyWarHistory from "../components/organisms/companywarhistory";
import { useState } from "react";
import CompanyStatOverview from "./company-stat-overview";
// import Construction from "../components/molecules/construction";

const CompanyDetail: React.FC = () => {
    const { companyName } = useParams<{ companyName: string }>();
    const [page, setPage] = useState(0);

    if (!companyName) return (<NotFound />);
    const { loading, error, company, wars, members, leaderboards } = useCompanyDetails(companyName);

    if (loading) return (<span className="text-white" ><Loading /></span>);
    if (error || !company || !leaderboards) return (<span className="text-white" ><NotFound /></span>);

    const content = [
        <CompanyStatOverview companyName={companyName} wars={wars} leaderboard={leaderboards.entries} />,
        <CompanyWarHistory companyName={companyName} wars={wars} />,
        <CompanyMembersTable members={members} />
    ]

    return (
        <div className="flex flex-col mx-auto max-w-6xl pt-4 gap-4">
            <CompanyDetailCard company={company} />
            <div className="flex ">
                <button onClick={() => setPage(0)} className={`px-4 py-2 ${page === 0 ? "bg-blue-700" : "bg-gray-700"} text-white rounded-l-lg hover:bg-gray-600 transition`}>
                    Overview
                </button>
                <button onClick={() => setPage(1)} className={`px-4 py-2 ${page === 1 ? "bg-blue-700" : "bg-gray-700"} text-white  hover:bg-gray-600 transition`}>
                    War History
                </button>
                <button onClick={() => setPage(2)} className={`px-4 py-2 ${page === 2 ? "bg-blue-700" : "bg-gray-700"} text-white rounded-r-lg hover:bg-gray-600 transition`}>
                    Roster
                </button>
            </div>
            <div className={`flex gap-4 mx-auto justify-center w-full`}>
                {content[page]}
            </div>
        </div >
    );
}

export default CompanyDetail;
