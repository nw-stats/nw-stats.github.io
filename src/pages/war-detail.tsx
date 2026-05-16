import { useParams, useSearchParams } from "react-router-dom";
import LeaderboardDisplay from "../components/molecules/leaderboarddisplay";
import { useWarData } from "../hooks/useWarData";
import Loading from "../components/atom/loading";

import { WarResultsCompanyCombined } from "../components/molecules/warresultscompanycombined";
import NotFound from "./notfound";
import DataEntryInProgress from "./dataentryinprogress";
import { CaptureTimes } from "../components/atom/capturetimes";
import { Tab, TabbedContent } from "../components/molecules/tabbedcontent";
import { GroupsSummary } from "../components/molecules/groupssummary";
import GroupsDetail from "../components/molecules/groupsdetails";
import { HealerCompare } from "../components/organisms/healercompare";
import { WarListCard } from "../components/molecules/warlistcard";
import { GroupsSummaryGraph } from "../components/molecules/groupssummarygraphy";
import { useMemo, useRef, useState, type JSX } from "react";
import Heatmap from "../components/molecules/heatmap";
import { getPressure } from "../utils/groups";
import { getHeatmapColor } from "../utils/heatmap";
import { factionColorVar } from "../utils/factions";




function WarDetail(): JSX.Element {
    const { warId } = useParams<{ warId: string, slug: string }>();
    const [searchParams, setSearchParams] = useSearchParams();
    const screenshotRef = useRef<HTMLDivElement>(null);
    const warIdNum = Number(warId);
    const { loading, error, war, companies, leaderboard, summary, groupDetails, healerSummary } = useWarData(warIdNum);

    // const [ssLoading, setSsLoading] = useState(false);

    const outerTab = searchParams.get("o") ?? "Groups Detail";
    const setOuterTab = (outter: string) => {
        setSearchParams(prev => {
            const next = new URLSearchParams(prev);
            next.set("o", outter);
            return next;
        });
    };
    const innerTab = searchParams.get("i") ?? war?.attacker.name ?? "All";
    const setInnerTab = (inner: string) => {
        setSearchParams(prev => {
            const next = new URLSearchParams(prev);
            next.set("i", inner);
            return next;
        });
    };

    const [lbTab, setLbTab] = useState("All");

    const goldStar = searchParams.has("weenie") ?? false;

    const heatmap = useMemo(() => {
        const neutral = {
            point: { attacker: 0, defender: 0, color: "#eeeeee" },
            topLeft: { attacker: 0, defender: 0, color: "#eeeeee" },
            topRight: { attacker: 0, defender: 0, color: "#eeeeee" },
            bottomLeft: { attacker: 0, defender: 0, color: "#eeeeee" },
            bottomRight: { attacker: 0, defender: 0, color: "#eeeeee" },
            weak: { attacker: 0, defender: 0, color: "#eeeeee" },
            strong: { attacker: 0, defender: 0, color: "#eeeeee" },
            outer: { attacker: 0, defender: 0, color: "#eeeeee" },
            wide: { attacker: 0, defender: 0, color: "#eeeeee" },
        };
        if (!war) return neutral;

        const atkGrps = groupDetails.get(war.attacker.name);
        const defGrps = groupDetails.get(war.defender.name);
        if (!atkGrps || !defGrps) return neutral;
        const pressure = getPressure(atkGrps, defGrps);
        const attackerColor = factionColorVar(war.attacker.faction);
        const defenderColor = factionColorVar(war.defender.faction);
        const neutralColor = factionColorVar('Gray');
        return {
            point: {
                attacker: pressure.attackPressure.get(1)! / 2 + pressure.attackPressure.get(2)! / 2,
                defender: pressure.defendPressure.get(1)! / 2 + pressure.defendPressure.get(2)! / 2,
                color: getHeatmapColor(
                    pressure.attackPressure.get(1)! / 2 + pressure.attackPressure.get(2)! / 2 - pressure.defendPressure.get(1)! / 2 - pressure.defendPressure.get(2)! / 2,
                    pressure.maxPressure,
                    defenderColor,
                    neutralColor,
                    attackerColor
                )
            },
            topLeft: {
                attacker: pressure.attackPressure.get(6)!,
                defender: pressure.defendPressure.get(6)!,
                color: getHeatmapColor(
                    pressure.attackPressure.get(6)! - pressure.defendPressure.get(6)!,
                    pressure.maxPressure,
                    defenderColor,
                    neutralColor,
                    attackerColor
                )
            },
            topRight: {
                attacker: pressure.attackPressure.get(5)!,
                defender: pressure.defendPressure.get(5)!,
                color: getHeatmapColor(
                    pressure.attackPressure.get(5)! - pressure.defendPressure.get(5)!,
                    pressure.maxPressure,
                    defenderColor,
                    neutralColor,
                    attackerColor
                )
            },
            bottomLeft: {
                attacker: pressure.attackPressure.get(4)!,
                defender: pressure.defendPressure.get(4)!,
                color: getHeatmapColor(
                    pressure.attackPressure.get(4)! - pressure.defendPressure.get(4)!,
                    pressure.maxPressure,
                    defenderColor,
                    neutralColor,
                    attackerColor
                )
            },
            bottomRight: {
                attacker: pressure.attackPressure.get(3)!,
                defender: pressure.defendPressure.get(3)!,
                color: getHeatmapColor(
                    pressure.attackPressure.get(3)! - pressure.defendPressure.get(3)!,
                    pressure.maxPressure,
                    defenderColor,
                    neutralColor,
                    attackerColor
                )
            },
            weak: {
                attacker: pressure.attackPressure.get(7)!,
                defender: pressure.defendPressure.get(7)!,
                color: getHeatmapColor(
                    pressure.attackPressure.get(7)! - pressure.defendPressure.get(7)!,
                    pressure.maxPressure,
                    defenderColor,
                    neutralColor,
                    attackerColor
                )
            },
            strong: {
                attacker: pressure.attackPressure.get(8)!,
                defender: pressure.defendPressure.get(8)!,
                color: getHeatmapColor(
                    pressure.attackPressure.get(8)! - pressure.defendPressure.get(8)!,
                    pressure.maxPressure,
                    defenderColor,
                    neutralColor,
                    attackerColor
                )
            },
            outer: {
                attacker: pressure.attackPressure.get(9)!,
                defender: pressure.defendPressure.get(9)!,
                color: getHeatmapColor(
                    pressure.attackPressure.get(9)! - pressure.defendPressure.get(9)!,
                    pressure.maxPressure,
                    defenderColor,
                    neutralColor,
                    attackerColor
                )
            },
            wide: {
                attacker: pressure.attackPressure.get(10)!,
                defender: pressure.defendPressure.get(10)!,
                color: getHeatmapColor(
                    pressure.attackPressure.get(10)! - pressure.defendPressure.get(10)!,
                    pressure.maxPressure,
                    defenderColor,
                    neutralColor,
                    attackerColor
                )
            }

        };

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


    // const handleScreenshot = async () => {
    //     if (!screenshotRef.current) return;

    //     try {
    //         if (!screenshotRef.current) return;
    //         setSsLoading(true);
    //         await new Promise(resolve => setTimeout(resolve, 0));

    //         const dataUrl = await toPng(screenshotRef.current, {
    //             cacheBust: true,
    //             skipFonts: true,
    //             backgroundColor: "#1f2937",
    //         });

    //         const link = document.createElement("a");
    //         link.download = `leaderboard_${formatDateTimeSlug(war.date)}_${war.attacker.name}_${war.defender.name}.png`;
    //         link.href = dataUrl;
    //         link.click();
    //     } finally {
    //         setSsLoading(false);
    //     }
    // };

    return (
        <div className="flex flex-col mx-auto max-w-7xl gap-8 mb-20">
            <div className="flex flex-col gap-4 p-2" ref={screenshotRef}>
                <div className="pt-8">
                    {/* <WarStatsPanel date={war.date} map={war.map} captures={war.captures} server={war.server} /> */}
                    <WarListCard war={war} goldStar={goldStar} />
                </div>
                <div className="flex flex-col gap-2 text-lg bg-surface-1 rounded-lg">
                    <WarResultsCompanyCombined summaries={[attackerSummary, defenderSummary]} factions={[war.attacker.faction, war.defender.faction]} attacker={war.attacker.name} defender={war.defender.name} goldStar={goldStar} />
                    <CaptureTimes captures={war.captures} />
                </div>

                {!hasLeaderboard ? (
                    <DataEntryInProgress />
                ) : (
                    <div className="text-sm relative">
                        {/* <CameraButton onClick={handleScreenshot} loading={ssLoading} /> */}
                        <TabbedContent
                            activeLabel={outerTab}
                            onChangeLabel={(label) => {
                                setOuterTab(label)
                                if (label === 'Leaderboard') setLbTab("All");
                            }}
                        >
                            <Tab label="Groups Detail">
                                <TabbedContent
                                    key={`details-${war.attacker.name}-${war.defender.name}`}
                                    activeLabel={innerTab}
                                    onChangeLabel={(label) => {
                                        setInnerTab(label);
                                    }}
                                >
                                    <Tab label={war.attacker.name}>
                                        <GroupsDetail groups={attackerGroups} hideRoles={war.hideRoles} goldStar={goldStar} />
                                    </Tab>
                                    <Tab label={war.defender.name}>
                                        <GroupsDetail groups={defenderGroups} hideRoles={war.hideRoles} goldStar={goldStar} />
                                    </Tab>
                                </TabbedContent>
                            </Tab>
                            <Tab label="Groups Summary">
                                <TabbedContent
                                    key={`summary-${war.attacker.name}-${war.defender.name}`}
                                    activeLabel={innerTab}
                                    onChangeLabel={(label) => {
                                        setInnerTab(label);
                                    }}
                                >
                                    <Tab label={war.attacker.name}>
                                        <GroupsSummary groups={attackerGroups} goldStar={goldStar} />
                                    </Tab>
                                    <Tab label={war.defender.name}>
                                        <GroupsSummary groups={defenderGroups} goldStar={goldStar} />
                                    </Tab>
                                </TabbedContent>
                            </Tab>
                            <Tab label="Pressure">
                                <TabbedContent key={`heatmap-${war.attacker.name}-${war.defender.name}`}>
                                    <Heatmap
                                        point={heatmap.point}
                                        topLeft={heatmap.topLeft}
                                        topRight={heatmap.topRight}
                                        bottomLeft={heatmap.bottomLeft}
                                        bottomRight={heatmap.bottomRight}
                                        weak={heatmap.weak}
                                        strong={heatmap.strong}
                                        outer={heatmap.outer}
                                        wide={heatmap.wide}
                                        attackerColor={factionColorVar(war.attacker.faction)}
                                        defenderColor={factionColorVar(war.defender.faction)}
                                        neutralColor={factionColorVar('Gray')}
                                        attackerName={war.attacker.name}
                                        defenderName={war.defender.name} />
                                </TabbedContent>
                            </Tab>
                            <Tab label="Graphs">
                                <TabbedContent
                                    key={`graphs-${war.attacker.name}-${war.defender.name}`}
                                    activeLabel={innerTab}
                                    onChangeLabel={(label) => {
                                        setInnerTab(label);
                                    }}>
                                    <Tab label={war.attacker.name}>
                                        <GroupsSummaryGraph groups={attackerGroups} />
                                    </Tab>
                                    <Tab label={war.defender.name}>
                                        <GroupsSummaryGraph groups={defenderGroups} />
                                    </Tab>
                                </TabbedContent>
                            </Tab>
                            <Tab label="Healer">
                                <HealerCompare attackerName={war.attacker.name} defenderName={war.defender.name} attackerHealers={attackerHealer} defenderHealers={defenderHealer} />
                            </Tab>
                            <Tab label="Leaderboard">
                                <TabbedContent
                                    key={`leaderboard-${war.attacker.name}-${war.defender.name}`}
                                    activeLabel={lbTab}
                                    onChangeLabel={(label) => {
                                        if (label !== 'All') setInnerTab(label);
                                        setLbTab(label);
                                    }}
                                >
                                    <Tab label={war.attacker.name}>
                                        <LeaderboardDisplay
                                            leaderboard={attackerLeaderboard}
                                            companies={companies}
                                            hideRoles={war.hideRoles}
                                            goldStar={goldStar}
                                        />
                                    </Tab>
                                    <Tab label={war.defender.name}>
                                        <LeaderboardDisplay
                                            leaderboard={defenderLeaderboard}
                                            companies={companies}
                                            hideRoles={war.hideRoles}
                                            goldStar={goldStar}
                                        />
                                    </Tab>
                                    <Tab label={"All"}>
                                        <LeaderboardDisplay
                                            leaderboard={combinedLeaderboard}
                                            companies={companies}
                                            hideRoles={war.hideRoles}
                                            goldStar={goldStar}
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

//     if (loading) return <div className="flex w-full justify-center text-foreground p-8" ><Loading /></div >;
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
