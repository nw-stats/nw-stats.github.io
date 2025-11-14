// import { useParams, useSearchParams } from "react-router-dom";
// import LeaderboardDisplay from "../components/molecules/leaderboarddisplay";
// import Loading from "../components/atom/loading";
// import { WarResultsCompanyCombined } from "../components/molecules/warresultscompanycombined";
// import { useEffect, useRef, useState, type JSX } from "react";
// import NotFound from "./notfound";
// import DataEntryInProgress from "./dataentryinprogress";
// import { CaptureTimes } from "../components/atom/capturetimes";
// import { toPng } from "html-to-image";
// import { formatDateTimeSlug } from "../utils/time";
// import { CameraButton } from "../components/atom/camerabutton";
// import { Tab, TabbedContent } from "../components/molecules/tabbedcontent";
// import { HealerCompare } from "../components/organisms/healercompare";
// import { WarListCard } from "../components/molecules/warlistcard";
// import { useWarDetail } from "../hooks/useWarDetail";



// function WarDetail(): JSX.Element {
//     const { warId: warIdParam } = useParams<{ warId: string, slug: string }>();
//     const [searchParams, setSearchParams] = useSearchParams();
//     const screenshotRef = useRef<HTMLDivElement>(null);
//     const warId = Number(warIdParam);

//     const {
//         data: { war, leaderboard },
//         isLoading,
//         isError
//     } = useWarDetail({ warId });

//     const [ssLoading, setSsLoading] = useState(false);

//     const outerTab = searchParams.get("o") ?? "Groups Detail";
//     const innerTab = searchParams.get("i") ?? war?.attacker.name ?? "All";

//     const [lbTab, setLbTab] = useState("All");
//     useEffect(() => {
//         if (!war) return;

//         const attackerGroups = groupDetails.get(war.attacker.name);
//         const defenderGroups = groupDetails.get(war.defender.name);

//         const hasAttacker = attackerGroups && attackerGroups.size > 0;
//         const hasDefender = defenderGroups && defenderGroups.size > 0;

//         const currentInner = searchParams.get("i");
//         const currentOuter = searchParams.get("o");

//         let nextOuter = currentOuter || "Groups Detail";
//         let nextInner = currentInner || war.attacker.name;

//         if (!hasAttacker && hasDefender) {
//             nextInner = currentInner || war.defender.name;
//         } else if (!hasAttacker && !hasDefender) {
//             nextOuter = currentOuter || "Leaderboard";
//             nextInner = currentInner || "All";
//         }

//         setOuterTab(nextOuter);
//         setInnerTab(nextInner);
//     }, [war, groupDetails]);

//     const setOuterTab = (label: string) => {
//         setSearchParams(prev => {
//             const params = new URLSearchParams(prev);
//             params.set("o", label);
//             return params;
//         });
//     };

//     const setInnerTab = (label: string) => {
//         setSearchParams(prev => {
//             const params = new URLSearchParams(prev);
//             params.set("i", label);
//             return params;
//         });
//     };

//     if (loading) return <Loading />;
//     if (error) return <NotFound />;
//     if (!war) return <NotFound />;

//     const attackerLeaderboard = leaderboard.get(war.attacker.name);
//     const defenderLeaderboard = leaderboard.get(war.defender.name);
//     const combinedLeaderboard = leaderboard.get("All");
//     const attackerSummary = summary.get(war.attacker.name);
//     const defenderSummary = summary.get(war.defender.name);
//     const attackerGroups = groupDetails.get(war.attacker.name);
//     const defenderGroups = groupDetails.get(war.defender.name);
//     const attackerHealer = healerSummary.get(war.attacker.name);
//     const defenderHealer = healerSummary.get(war.defender.name);
//     const hasLeaderboard = combinedLeaderboard !== undefined;

//     const handleScreenshot = async () => {
//         if (!screenshotRef.current) return;

//         try {
//             if (!screenshotRef.current) return;
//             setSsLoading(true);
//             await new Promise(resolve => setTimeout(resolve, 0));

//             const dataUrl = await toPng(screenshotRef.current, {
//                 cacheBust: true,
//                 skipFonts: true,
//                 backgroundColor: "#1f2937",
//             });

//             const link = document.createElement("a");
//             link.download = `leaderboard_${formatDateTimeSlug(war.date)}_${war.attacker.name}_${war.defender.name}.png`;
//             link.href = dataUrl;
//             link.click();
//         } finally {
//             setSsLoading(false);
//         }
//     };

//     return (
//         <div className="flex flex-col mx-auto max-w-7xl gap-8 mb-20">
//             <div className="flex flex-col gap-4 p-2" ref={screenshotRef}>
//                 <div className="pt-8">
//                     {/* <WarStatsPanel date={war.date} map={war.map} captures={war.captures} server={war.server} /> */}
//                     <WarListCard war={war} />
//                 </div>
//                 <div className="flex flex-col gap-2 text-lg bg-gray-700 rounded-lg">
//                     <WarResultsCompanyCombined summaries={[attackerSummary, defenderSummary]} factions={[war.attacker.faction, war.defender.faction]} attacker={war.attacker.name} defender={war.defender.name} />
//                     <CaptureTimes captures={war.captures} />
//                 </div>

//                 {!hasLeaderboard ? (
//                     <DataEntryInProgress />
//                 ) : (
//                     <div className="text-sm relative">
//                         <CameraButton onClick={handleScreenshot} loading={ssLoading} />
//                         <TabbedContent
//                             activeLabel={outerTab}
//                             onChangeLabel={(label) => {
//                                 setOuterTab(label)
//                                 if (label === 'Leaderboard') setLbTab("All");
//                             }}
//                         >
//                             <Tab label="Leaderboard">
//                                 <TabbedContent
//                                     key={`leaderboard-${war.attacker.name}-${war.defender.name}`}
//                                     activeLabel={lbTab}
//                                     onChangeLabel={(label) => {
//                                         if (label !== 'All') setInnerTab(label);
//                                         setLbTab(label);
//                                     }}
//                                 >
//                                     <Tab label={"All"}>
//                                         <LeaderboardDisplay
//                                             leaderboard={combinedLeaderboard}
//                                             hideRoles={war.hideRoles}
//                                         />
//                                     </Tab>
//                                     <Tab label={war.attacker.name}>
//                                         <LeaderboardDisplay
//                                             leaderboard={attackerLeaderboard}
//                                             hideRoles={war.hideRoles}
//                                         />
//                                     </Tab>
//                                     <Tab label={war.defender.name}>
//                                         <LeaderboardDisplay
//                                             leaderboard={defenderLeaderboard}
//                                             hideRoles={war.hideRoles}
//                                         />
//                                     </Tab>
//                                 </TabbedContent>
//                             </Tab>
//                             <Tab label="Groups Summary">
//                                 <TabbedContent
//                                     key={`summary-${war.attacker.name}-${war.defender.name}`}
//                                     activeLabel={innerTab}
//                                     onChangeLabel={(label) => {
//                                         setInnerTab(label);
//                                     }}
//                                 >
//                                     {/* <Tab label={war.attacker.name}>

//                                         <GroupsSummary groups={attackerGroups} />
//                                     </Tab>
//                                     <Tab label={war.defender.name}>
//                                         <GroupsSummary groups={defenderGroups} />
//                                     </Tab> */}
//                                 </TabbedContent>
//                             </Tab>
//                             <Tab label="Groups Detail">
//                                 <TabbedContent
//                                     key={`details-${war.attacker.name}-${war.defender.name}`}
//                                     activeLabel={innerTab}
//                                     onChangeLabel={(label) => {
//                                         setInnerTab(label);
//                                     }}
//                                 >
//                                     {/* <Tab label={war.attacker.name}>
//                                         <GroupsDetail groups={attackerGroups} hideRoles={war.hideRoles} />
//                                     </Tab>
//                                     <Tab label={war.defender.name}>
//                                         <GroupsDetail groups={defenderGroups} hideRoles={war.hideRoles} />
//                                     </Tab> */}
//                                 </TabbedContent>
//                             </Tab>

//                             <Tab label="Healer">
//                                 <HealerCompare attackerName={war.attacker.name} defenderName={war.defender.name} attackerHealers={attackerHealer} defenderHealers={defenderHealer} />
//                             </Tab>
//                         </TabbedContent>
//                     </div>
//                 )}
//             </div>
//             <div>
//                 {/* {!hasLeaderboard && <LeaderboardDisplay leaderboard={leaderboard} companies={companies} hideRoles={war.hideRoles} />} */}
//             </div>
//         </div >
//     );
// }

// export default WarDetail;
import type { JSX } from "react";
import { useParams } from "react-router-dom";
import Loading from "../components/atom/loading";
import NotFound from "./notfound";
import { useWarDetail } from "../hooks/useWarDetail";
import { logging } from "../utils/logging";
import { WarListCard } from "../components/molecules/warlistcard";
import LeaderboardDisplay from "../components/molecules/leaderboarddisplay";
import { WarSummary } from "../components/molecules/warSummary";
import { GroupsDetails } from "../components/molecules/groupsdetails";

export function WarDetail(): JSX.Element {
    const { warId: warIdParam } = useParams<{ warId: string }>();
    const warId = Number(warIdParam);

    const {
        data: { war, leaderboard, summaries, groups },
        isLoading,
        isError
    } = useWarDetail({ warId });

    logging('WarDetail:IsError', isError);
    logging('WarDetail:IsLoading', isLoading);
    logging('WarDetail:War', war);
    logging('WarDetail:Leaderboard', leaderboard);
    logging('WarDetail:Summaries', summaries);
    logging('WarDetaik:Groups', groups);

    if (isLoading) return <Loading />;
    if (isError) return <NotFound />;
    if (!war) return <NotFound />
    return (
        <>
            <WarListCard war={war} />
            <WarSummary
                attacker={war.attacker}
                defender={war.defender}
                attackerSummary={summaries?.get(war.attacker.name)}
                defenderSummary={summaries?.get(war.defender.name)} />
            <GroupsDetails />
            <LeaderboardDisplay leaderboard={leaderboard} hideRoles={war.hideRoles} />
        </>
    );

}
