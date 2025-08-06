import type { JSX } from "react";
import type { War } from "../types/war";
import { summarize, summarizeWars } from "../utils/leaderboard";
import type { LeaderboardEntry } from "../types/leaderboard";

import StatHighlight from "../components/atom/stathighlight";
import NumberCell from "../components/atom/numbercell";
import { formatPercent } from "../utils/format";


interface CompanyStatOverviewProps {
    companyName: string
    wars: War[],
    leaderboard: LeaderboardEntry[]
}
function CompanyStatOverview({ companyName, wars, leaderboard }: CompanyStatOverviewProps): JSX.Element {
    const lbSummary = summarize(leaderboard);
    const warSummary = summarizeWars(wars, companyName);

    // const data = [
    //     { name: "Win", value: warSummary.attack.win + warSummary.defense.win },
    //     { name: "Loss", value: warSummary.attack.loss + warSummary.defense.loss },
    // ];
    // const COLORS = ['#4ade80', '#f87171', '#facc15']; // Tailwind green-400, red-400, yellow-400
    return (
        <div className="flex gap-2">
            {/* <div className="flex-1 text-w">
                <div className="flex flex-col items-center text-left gap-2">
                    <h1 className="text-white text-xl font-semibold text-left">Win/Loss</h1>
                    <div className="bg-gray-800 p-4 rounded-lg w-auto h-auto">
                        <ResponsiveContainer width={250} height={180}>
                            <PieChart>
                                <Pie
                                    data={data}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    label
                                    startAngle={270}
                                    endAngle={-90}
                                    animationDuration={0.1}
                                >
                                    {data.map((entry, index) => (
                                        <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div > */}
            <div className="flex-2">
                <div className="flex flex-col gap-6 text-white">
                    <div>
                        <h1 className="text-xl font-semibold mb-2">Win/Loss</h1>
                        <div className="grid grid-cols-3 gap-4">
                            <StatHighlight title="Wars" text={<NumberCell value={wars.length} />} />
                            <StatHighlight title="Wins" text={<NumberCell value={warSummary.overall.win} />} />
                            <StatHighlight title="Loss" text={<NumberCell value={warSummary.overall.loss} />} />
                            <StatHighlight title="Win Rate" text={formatPercent((warSummary.overall.win / warSummary.overall.count), 2)} />
                            <StatHighlight title="Attack Win Rate" text={formatPercent((warSummary.attack.win / warSummary.attack.count), 2)} />
                            <StatHighlight title="Defense Win Rate" text={formatPercent((warSummary.defense.win / warSummary.defense.count), 2)} />
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
