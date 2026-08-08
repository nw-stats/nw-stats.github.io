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
import { useState, type JSX } from "react";
import Heatmap from "../components/molecules/heatmap";
import { factionColorVar, factionColorVarMax, factionColorVarMin } from "../utils/factions";
import { resolveCssVar } from "../utils/colors";
import { useSeason } from "../hooks/base/useSeason";
import { kSheetIds } from "../constants/sheets";
import { useHeatmap } from "../hooks/useHeatmap";


function WarDetail(): JSX.Element {
    const { warId } = useParams<{ warId: string, slug: string }>();
    const [searchParams, setSearchParams] = useSearchParams();
    const { season } = useSeason();
    const warIdNum = Number(warId);
    const { loading, error, war, companies, leaderboard, summary, groupDetails, healerSummary } = useWarData(kSheetIds[season], warIdNum);

    const outerTab = searchParams.get("o") ?? "Groups Detail";
    const setOuterTab = (outter: string) => {
        setSearchParams(prev => {
            const next = new URLSearchParams(prev);
            next.set("o", outter);
            return next;
        }, { replace: true });
    };
    const innerTab = searchParams.get("i") ?? war?.attacker.name ?? "All";
    const setInnerTab = (inner: string) => {
        setSearchParams(prev => {
            const next = new URLSearchParams(prev);
            next.set("i", inner);
            return next;
        }, { replace: true });
    };

    const [lbTab, setLbTab] = useState("All");

    const goldStar = searchParams.has("weenie");

    const heatmap = useHeatmap(war, groupDetails);

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
    const allGroups = groupDetails.get("All");

    const attackerColorRange = {
        from: resolveCssVar(factionColorVarMin(war.attacker.faction)),
        to: resolveCssVar(factionColorVarMax(war.attacker.faction)),
    };
    const defenderColorRange = {
        from: resolveCssVar(factionColorVarMin(war.defender.faction)),
        to: resolveCssVar(factionColorVarMax(war.defender.faction)),
    };

    return (
        <div className="flex flex-col mx-auto max-w-7xl gap-8 mb-20" >
            <div className="flex flex-col gap-4 p-2">
                <div className="pt-8">
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
                                    <Tab label="All">
                                        <GroupsDetail groups={allGroups} hideRoles={war.hideRoles} goldStar={goldStar} />
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
                                    <Tab label="All">
                                        I'm working on it
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
                                        <GroupsSummaryGraph groups={attackerGroups}
                                            colorRange={attackerColorRange} />
                                    </Tab>
                                    <Tab label={war.defender.name}>
                                        <GroupsSummaryGraph groups={defenderGroups}
                                            colorRange={defenderColorRange} />
                                    </Tab>
                                    <Tab label="All">
                                        ¯\(ツ)/¯
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
        </div >
    );

}

export default WarDetail;
