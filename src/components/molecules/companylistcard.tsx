import { Link } from "react-router-dom";
import type { Company } from "../../types/company";
import { factionBgPrimary } from "../../utils/factions";
import type { JSX } from "react";

export interface CompanyListCardProps {
    company: Company,
}
export function CompanyListCard({ company }: CompanyListCardProps): JSX.Element {
    const color = factionBgPrimary(company.faction);
    return (
        <Link to={`/companies/${company.name}`}>
            <div className="flex bg-gray-800 gap-1 hover:scale-105 rounded-lg relative">
                <div className={`absolute inset-0 ${color} w-4 rounded-l-lg`}></div>
                <div className="flex-col gap-1 p-2 relative pl-6">
                    <div>
                        {company.name}
                    </div>
                    <div className="text-xs text-gray-400">
                        {company.faction}
                    </div>
                    <div className="text-xs text-gray-400">
                        {company.server}
                    </div>
                </div>
            </div>
        </Link >
    );
}
