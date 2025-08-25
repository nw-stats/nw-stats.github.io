import type { JSX } from "react";
import type { War } from "../../types/hydratedtypes/war";
import WarListCard from "../molecules/warlistcard";
import { NoData } from "../atom/nodata";

interface CompanyWarHistoryProps {
    companyName: string
    wars: War[];
}

function CompanyWarHistory({ wars }: CompanyWarHistoryProps): JSX.Element {
    return (
        <div className="flex flex-col gap-2 w-full" >
            {wars.length > 0 ?
                wars.map(war => (
                    <div className="hover:scale-105">
                        <WarListCard war={war} />
                    </div>
                )) :
                <NoData />}
        </div >
    );
}

export default CompanyWarHistory;
