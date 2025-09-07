import type { JSX } from "react";
import { summarizeWars } from "../utils/leaderboard";
import type { Leaderboard } from "../types/leaderboard";

import StatHighlight from "../components/atom/stathighlight";
import NumberCell from "../components/atom/numbercell";
import { formatPercent } from "../utils/format";
import { summarizeLeaderboard } from "../transformers/leaderboard";
import type { War } from "../types/war";


interface CompanyStatOverviewProps {
    companyName: string
    wars: War[],
    leaderboard: Leaderboard
}
function CompanyStatOverview({ companyName, wars, leaderboard }: CompanyStatOverviewProps): JSX.Element {
    const lbSummary = summarizeLeaderboard(leaderboard);
    const warSummary = summarizeWars(wars, companyName);

    return (
        <div className="flex gap-2">

            <div className="flex-2">
                <div className="flex flex-col gap-6 text-white">
                    <div>
                        <h1 className="text-xl font-semibold mb-2">Win/Loss</h1>
                        <div className="grid grid-cols-3 gap-4">
                            <StatHighlight title="Wars" text={<NumberCell value={wars.length} />} />
                            <StatHighlight title="Wins" text={<NumberCell value={warSummary.overall.win} />} />
                            <StatHighlight title="Loss" text={<NumberCell value={warSummary.overall.loss} />} />
                            <StatHighlight title="Win Rate" text={formatPercent(warSummary.overall.rate, 2)} />
                            <StatHighlight title="Attack Win Rate" text={formatPercent(warSummary.attack.rate, 2)} />
                            <StatHighlight title="Defense Win Rate" text={formatPercent(warSummary.defense.rate, 2)} />
                        </div>
                    </div>
                    <div>
                        <h1 className="text-xl font-semibold mb-2">KDA</h1>
                        <div className="grid grid-cols-3 gap-4">
                            <StatHighlight title="Kills" text={<NumberCell value={lbSummary.kills} />} />
                            <StatHighlight title="Deaths" text={<NumberCell value={lbSummary.deaths} />} />
                            <StatHighlight title="Assists" text={<NumberCell value={lbSummary.assists} />} />
                        </div>
                    </div>
                    <div>
                        <h1 className="text-xl font-semibold mb-2">Territories</h1>
                        <div className="grid grid-cols-3 gap-4">
                            <StatHighlight title="Most Played" text={warSummary.mostPlayed.name} subtext={String(warSummary.mostPlayed.count)} />
                            <StatHighlight title="Most Wins" text={warSummary.mostWin.name} subtext={String(warSummary.mostWin.count)} />
                            <StatHighlight title="Most Losses" text={warSummary.mostLoss.name} subtext={String(warSummary.mostLoss.count)} />
                        </div>
                    </div>
                </div>
            </div>
            {/* <div className="flex-1">
                <div className="flex max-w-full h-full">
                    <WinLossChart dates={wars.slice(0, 5).map(v => v.date)} wins={wars.slice(0, 5).map(v => companyName === v.winner)} />
                </div>
            </div> */}
        </div >

    );
}
export default CompanyStatOverview;
