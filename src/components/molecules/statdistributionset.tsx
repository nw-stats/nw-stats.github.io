import type { JSX } from "react";
import type { PerformanceProfile, StatZScore } from "../../domain/stats/types";
import DistributionChart from "../atom/distributionchart";
import { STAT_KEYS } from "../../domain/stats/const";

interface StatDistributionSetProps {
    performanceProfile: PerformanceProfile;
    playerPerformance: StatZScore;
    title?: string;
}
export function StatDistributionSet({
    performanceProfile,
    playerPerformance,
    title
}: StatDistributionSetProps): JSX.Element {
    return (
        <div className="flex flex-col">
            <div className="mb-4">{title}</div>
            <div className="grid grid-cols-5">
                {STAT_KEYS.map(k => (
                    <DistributionChart
                        value={playerPerformance[k]}
                        mean={performanceProfile[k].mean}
                        stdev={performanceProfile[k].sd}
                        title={k}
                        height={150} />
                ))}
            </div>
        </div>
    );
}
