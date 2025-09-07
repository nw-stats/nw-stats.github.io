
import { useParams } from "react-router-dom";

import NotFound from "./notfound";

import Loading from "../components/atom/loading";
import { type JSX } from "react";
import { useCompanyDetails } from "../hooks/useCompanyDetails";
// import Construction from "../components/molecules/construction";

export function CompanyDetail(): JSX.Element {
    const { companyName } = useParams<{ companyName: string }>();
    const { data: details, isLoading, isError } = useCompanyDetails({ name: companyName });

    if (!companyName) return (<NotFound />);

    if (isLoading) return (<span className="text-white" ><Loading /></span>);
    if (isError) return (<span className="text-white" ><NotFound /></span>);



    return (
        <>{details}</>
    );
}
