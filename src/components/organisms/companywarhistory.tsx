import type { JSX } from "react";
import type { War } from "../../types/war";
import WarListCard from "../molecules/warlistcard";

interface CompanyWarHistoryProps {
    companyName: string
    wars: War[];
}

function CompanyWarHistory({ wars }: CompanyWarHistoryProps): JSX.Element {
    return (
        <div className="flex flex-col gap-2 w-full" >
            {wars.map(war => (
                <div className="hover:scale-105">
                    <WarListCard war={war} />
                </div>
            ))}
        </div >
    );
}

export default CompanyWarHistory;
