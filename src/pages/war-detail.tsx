import { useParams } from "react-router-dom";
import LeaderboardDisplay from "../components/molecules/leaderboarddisplay";
// import WarResultsCompany from "../components/molecules/warresultscompany";
// import WarStatsPanel from "../components/molecules/warstatspanel";
import { useWarData } from "../hooks/useWarData";
import GroupsComponent from "../components/molecules/groupscomponent";
import Loading from "../components/atom/loading";

import { WarResultsCompanyCombined } from "../components/molecules/warresultscompanycombined";
import { type JSX } from "react";
import NotFound from "./notfound";
// import DataEntryInProgress from "./dataentryinprogress";
import WarListCard from "../components/molecules/warlistcard";
import DataEntryInProgress from "./dataentryinprogress";
import { CaptureTimes } from "../components/atom/capturetimes";
// import Heatmap from "../components/molecules/heatmap";


function WarDetail(): JSX.Element {
    const { warId } = useParams<{ warId: string, slug: string }>();

    const warIdNum = Number(warId);
    const { loading, error, war, companies, leaderboard, summary, groupDetails, groupsSummary } = useWarData(warIdNum);

    if (loading) return <Loading />;
    if (error) {
        return <NotFound />;
    }
    if (!war) {
        return <NotFound />;
    }

    const attackerSummary = summary.get(war.attacker.name);
    const defenderSummary = summary.get(war.defender.name);

    const attackerCompany = companies.get(war.attacker.name);
    const defenderCompany = companies.get(war.defender.name);
    if (!attackerCompany || !defenderCompany) {
        return <NotFound />;
    }

    const attackerGroups = groupDetails.get(war.attacker.name);
    const defenderGroups = groupDetails.get(war.defender.name);

    const attackerGroupSummary = groupsSummary.get(war.attacker.name);
    const defenderGroupSummary = groupsSummary.get(war.defender.name);


    return (
        <div className="flex flex-col mx-auto max-w-7xl gap-8 mb-20">
            <div className="pt-8">
                {/* <WarStatsPanel date={war.date} map={war.map} captures={war.captures} server={war.server} /> */}
                <WarListCard war={war} />
            </div>
            <div className="flex flex-col gap-2 text-lg bg-gray-700 rounded-lg">
                <WarResultsCompanyCombined summaries={[attackerSummary, defenderSummary]} factions={[attackerCompany.faction, defenderCompany.faction]} attacker={war.attacker.name} defender={war.defender.name} />
                <CaptureTimes captures={war.captures} />
            </div>

            {!leaderboard && <DataEntryInProgress />}

            <div className="text-sm">
                {leaderboard && <GroupsComponent attackerName={war.attacker.name} defenderName={war.defender.name} attackerGroups={attackerGroups} defenderGroups={defenderGroups} attackerSummary={attackerGroupSummary} defenderSummary={defenderGroupSummary} />}
            </div>
            <div>
                {leaderboard && <LeaderboardDisplay leaderboard={leaderboard} companies={companies} />}
            </div>
        </div>
    );

}

export default WarDetail;

// const WarDetail: React.FC = () => {

//     const { warId } = useParams<{ warId: string }>();
//     const warIdNum = Number(warId);
//     const { loading, error, war, leaderboard, summary, factions, groupSummary, groupDetails: groupPerformance } = useWarData(warIdNum);

//     if (loading) return <div className="flex w-full justify-center text-white p-8" ><Loading /></div >;
//     if (error || !leaderboard || !war) return <ErrorPage error={error} />

//     const attackerSummary = summary.get(war.attacker);
//     const defenderSummary = summary.get(war.defender);
//     const attackerFaction = factions.get(war.attacker);
//     const defenderFaction = factions.get(war.defender);
//     const attackerGroupSummary = groupSummary.get(war.attacker);
//     const defenderGroupSummary = groupSummary.get(war.defender);
//     const attackerGroups = groupPerformance.get(war.attacker);
//     const defenderGroups = groupPerformance.get(war.defender);

//     if (!attackerSummary || !attackerFaction || !defenderSummary || !defenderFaction) {
//         return <div className="text-gray-500 p-8">Error loading leaderboard.</div>;
//     }


//     return (
//         <div className="bg-gray-900 flex justify-center px-4"> {/* fills screen & centers children */}
//             <div className="flex flex-col w-full justify-center gap-8 p-4">
//                 <div className="flex flex-col max-w-7xl w-full mx-auto gap-4 h-fit">

//                     <WarStatsPanel date={war.date} captures={{
//                         pointA: 300,
//                         pointB: 900,
//                         pointC: 1200,
//                         fort: 1800
//                     }} map={war.map} />


//                     <WarResultsCompanyCombined summaries={[attackerSummary, defenderSummary]} factions={[attackerFaction, defenderFaction]} winner={war.winner} attacker={war.attacker} />
//                     {/* <div className="flex flex-col md:flex-row gap-4 w-full"> */}
//                     {/* <div className="w-full md:w-1/2">
//                             <WarResultsCompany summary={attackerSummary} faction={attackerFaction} isAttacker={true} isWinner={war.winner === war.attacker} />
//                         </div>
//                         <div className="w-full md:w-1/2">
//                             <WarResultsCompany summary={defenderSummary} faction={defenderFaction} isAttacker={false} isWinner={war.winner === war.defender} />
//                         </div> */}
//                 </div>
//                 <div className="max-w-7xl w-full mx-auto">
//                     <GroupsComponent attackerName={war.attacker} attackerSummary={attackerGroupSummary} defenderName={war.defender} defenderSummary={defenderGroupSummary} attackerGroups={attackerGroups} defenderGroups={defenderGroups} />
//                 </div>
//                 <div className="max-w-7xl w-full mx-auto">
//                     <LeaderboardDisplay leaderboard={leaderboard} companies={factions} />
//                 </div>
//             </div>
//         </div>
//     );
// }
// export default WarDetail;
