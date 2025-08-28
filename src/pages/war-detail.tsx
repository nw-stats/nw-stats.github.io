import { useParams } from "react-router-dom";
import LeaderboardDisplay from "../components/molecules/leaderboarddisplay";
import { useWarData } from "../hooks/useWarData";
import Loading from "../components/atom/loading";

import { WarResultsCompanyCombined } from "../components/molecules/warresultscompanycombined";
import { useEffect, useRef, useState, type JSX } from "react";
import NotFound from "./notfound";
import WarListCard from "../components/molecules/warlistcard";
import DataEntryInProgress from "./dataentryinprogress";
import { CaptureTimes } from "../components/atom/capturetimes";
import { toPng } from "html-to-image";
import { formatDateTimeSlug } from "../utils/time";
import { CameraButton } from "../components/atom/camerabutton";
import { Tab, TabbedContent } from "../components/molecules/tabbedcontent";
import { GroupsSummary } from "../components/molecules/groupssummary";
import GroupsDetail from "../components/molecules/groupsdetails";
import { HealerCompare } from "../components/organisms/healercompare";



function WarDetail(): JSX.Element {
    const { warId } = useParams<{ warId: string, slug: string }>();
    const screenshotRef = useRef<HTMLDivElement>(null);
    const warIdNum = Number(warId);

    const { loading, error, war, companies, leaderboard, summary, groupDetails, healerSummary } = useWarData(warIdNum);

    const [ssLoading, setSsLoading] = useState(false);
    const [innerTabLabel, setInnerTabLabel] = useState<string>("");
    const [outerTabLabel, setOuterTabLabel] = useState<string>("");
    const [lastNonAllLabel, setLastNonAllLabel] = useState<string>("");

    useEffect(() => {
        if (!war) return;

        const attackerGroups = groupDetails.get(war.attacker.name);
        const defenderGroups = groupDetails.get(war.defender.name);

        const hasAttacker = attackerGroups && attackerGroups.size > 0;
        const hasDefender = defenderGroups && defenderGroups.size > 0;

        let nextOuter = "Groups Details";
        let nextInner = war.attacker.name;

        if (!hasAttacker && hasDefender) {
            nextInner = war.defender.name;
        } else if (!hasAttacker && !hasDefender) {
            nextOuter = "Leaderboard";
            nextInner = "All";
        }

        setOuterTabLabel(nextOuter);
        setInnerTabLabel(nextInner);
        setLastNonAllLabel(nextInner !== "All" ? nextInner : "");

    }, [war, groupDetails]);

    if (loading) return <Loading />;
    if (error) return <NotFound />;
    if (!war) return <NotFound />;


    const attackerLeaderboard = leaderboard.get(war.attacker.name);
    const defenderLeaderboard = leaderboard.get(war.defender.name);
    const combinedLeaderboard = leaderboard.get("All");
    const attackerSummary = summary.get(war.attacker.name);
    const defenderSummary = summary.get(war.defender.name);
    const attackerGroups = groupDetails.get(war.attacker.name);
    const defenderGroups = groupDetails.get(war.defender.name);
    const attackerHealer = healerSummary.get(war.attacker.name);
    const defenderHealer = healerSummary.get(war.defender.name);
    const hasLeaderboard = combinedLeaderboard !== undefined;

    const handleScreenshot = async () => {
        if (!screenshotRef.current) return;

        try {
            if (!screenshotRef.current) return;
            setSsLoading(true);
            await new Promise(resolve => setTimeout(resolve, 0));

            const dataUrl = await toPng(screenshotRef.current, {
                cacheBust: true,
                skipFonts: true,
                backgroundColor: "#1f2937",
            });

            const link = document.createElement("a");
            link.download = `leaderboard_${formatDateTimeSlug(war.date)}_${war.attacker.name}_${war.defender.name}.png`;
            link.href = dataUrl;
            link.click();
        } finally {
            setSsLoading(false);
        }
    };

    return (
        <div className="flex flex-col mx-auto max-w-7xl gap-8 mb-20">
            <div className="flex flex-col gap-4 p-2" ref={screenshotRef}>
                <div className="pt-8">
                    {/* <WarStatsPanel date={war.date} map={war.map} captures={war.captures} server={war.server} /> */}
                    <WarListCard war={war} />
                </div>
                <div className="flex flex-col gap-2 text-lg bg-gray-700 rounded-lg">
                    <WarResultsCompanyCombined summaries={[attackerSummary, defenderSummary]} factions={[war.attacker.faction, war.defender.faction]} attacker={war.attacker.name} defender={war.defender.name} />
                    <CaptureTimes captures={war.captures} />
                </div>

                {!hasLeaderboard ? (
                    <DataEntryInProgress />
                ) : (
                    <div className="text-sm relative">
                        <CameraButton onClick={handleScreenshot} loading={ssLoading} />
                        <TabbedContent
                            activeLabel={outerTabLabel}
                            onChangeLabel={setOuterTabLabel}
                        >
                            <Tab label="Groups Detail">
                                <TabbedContent
                                    key={`details-${war.attacker.name}-${war.defender.name}`}
                                    activeLabel={lastNonAllLabel}
                                    onChangeLabel={(label) => {
                                        setInnerTabLabel(label);
                                        if (label !== "All") setLastNonAllLabel(label);
                                    }}
                                >
                                    <Tab label={war.attacker.name}>
                                        <GroupsDetail groups={attackerGroups} hideRoles={war.hideRoles} />
                                    </Tab>
                                    <Tab label={war.defender.name}>
                                        <GroupsDetail groups={defenderGroups} hideRoles={war.hideRoles} />
                                    </Tab>
                                </TabbedContent>
                            </Tab>
                            <Tab label="Groups Summary">
                                <TabbedContent
                                    key={`summary-${war.attacker.name}-${war.defender.name}`}
                                    activeLabel={lastNonAllLabel}
                                    onChangeLabel={(label) => {
                                        setInnerTabLabel(label);
                                        if (label !== "All") setLastNonAllLabel(label);
                                    }}
                                >
                                    <Tab label={war.attacker.name}>

                                        <GroupsSummary groups={attackerGroups} />
                                    </Tab>
                                    <Tab label={war.defender.name}>
                                        <GroupsSummary groups={defenderGroups} />
                                    </Tab>
                                </TabbedContent>
                            </Tab>
                            <Tab label="Healer">
                                <HealerCompare attackerName={war.attacker.name} defenderName={war.defender.name} attackerHealers={attackerHealer} defenderHealers={defenderHealer} />
                            </Tab>
                            <Tab label="Leaderboard">
                                <TabbedContent
                                    key={`leaderboard-${war.attacker.name}-${war.defender.name}`}
                                    activeLabel={innerTabLabel}
                                    onChangeLabel={(label) => {
                                        setInnerTabLabel(label);
                                        if (label !== "All") setLastNonAllLabel(label);
                                    }}
                                >
                                    <Tab label={"All"}>
                                        <LeaderboardDisplay
                                            leaderboard={combinedLeaderboard}
                                            companies={companies}
                                            hideRoles={war.hideRoles}
                                        />
                                    </Tab>
                                    <Tab label={war.attacker.name}>
                                        <LeaderboardDisplay
                                            leaderboard={attackerLeaderboard}
                                            companies={companies}
                                            hideRoles={war.hideRoles}
                                        />
                                    </Tab>
                                    <Tab label={war.defender.name}>
                                        <LeaderboardDisplay
                                            leaderboard={defenderLeaderboard}
                                            companies={companies}
                                            hideRoles={war.hideRoles}
                                        />
                                    </Tab>
                                </TabbedContent>
                            </Tab>

                        </TabbedContent>
                    </div>
                )}
            </div>
            <div>
                {/* {!hasLeaderboard && <LeaderboardDisplay leaderboard={leaderboard} companies={companies} hideRoles={war.hideRoles} />} */}
            </div>
        </div >
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
