import type { JSX } from "react";
import type { Company } from "../../types/company";
import { factionBgPrimary } from "../../utils/factions";
import ProfilePicture from "../atom/profilepicture";

interface CompanyDetailCardProps {
    company: Company;
}
function CompanyDetailCard({ company }: CompanyDetailCardProps): JSX.Element {

    const color = factionBgPrimary(company.faction);
    return (
        <div className="flex flex-row">
            <div className={`${color} min-w-10 rounded-l-lg`}></div>
            <div className={`flex w-full items-center bg-gray-600 rounded-r-lg p-2 gap-2 text-white`}>
                <ProfilePicture pictureUrl="https://dqzvgunkova5o.cloudfront.net/statics/2025-06-20/images/NW-bug.svg" size={32} />
                <div className="flex flex-col">
                    <div className="flex items-end gap-2">
                        <div className="text-3xl font-semibold ">{company.name}</div>
                        {/* <div>{player.role}</div>s */}
                    </div>
                    <div className="flex flex-row w-full">
                        <div className="min-w-[100px]">{company.faction}</div>
                    </div>
                    <div className={`flex flex-row text-xl`}>
                        <div className="min-w-[100px]">Governor</div>
                        <div className="pr-2">|</div>
                        <div>{company.governor}</div>
                    </div>
                    <div className={`flex flex-row text-xl ${company.consuls.length > 0 ? 'visible' : 'invisible'}`}>
                        <div className="min-w-[100px]">Consuls</div>
                        <div className="pr-2">|</div>
                        <div>{company.consuls.join(', ')}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CompanyDetailCard
