import { Link } from "react-router-dom";
import type { Company } from "../../types/company";
import { factionBgPrimary } from "../../utils/factions";

export interface CompanyListCardProps {
    company: Company,
}
const CompanyListCard: React.FC<CompanyListCardProps> = ({ company }) => {
    const color = factionBgPrimary(company.faction);
    return (
        <Link to={`/companies/${company.name}`}>
            <div className="flex bg-gray-800 gap-1 hover:scale-105 rounded-lg">
                <div className={`${color} rounded-l-lg p-4`}>

                </div>
                <div className="flex-col gap-1 p-2">
                    <div>
                        {company.name}
                    </div>
                    <div className="text-xs text-gray-200">
                        {company.faction}
                    </div>
                </div>
            </div>
        </Link >
    );
};

export default CompanyListCard;
