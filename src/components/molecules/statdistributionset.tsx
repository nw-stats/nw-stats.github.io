import type { JSX } from "react";
import type { PerformanceProfile, StatZScore } from "../../domain/stats/types";
import DistributionChart from "../atom/distributionchart";
import { STAT_KEYS } from "../../domain/stats/const";

interface Series {
    name: string;
    value: StatZScore;
    color: string;
}
interface StatDistributionSetProps {
    performanceProfile: PerformanceProfile;
    playerPerformance: Series[];
    title?: string;
}
export function StatDistributionSet({
    performanceProfile,
    playerPerformance,
}: StatDistributionSetProps): JSX.Element {
    return (
        <div className="flex flex-col">
            <div className="grid grid-cols-1 md:grid-cols-5">
                {STAT_KEYS.map(k => (
                    <DistributionChart
                        values={playerPerformance.map(v => ({
                            name: v.name,
                            value: v.value[k],
                            color: v.color,
                        }))}
                        mean={performanceProfile[k].mean}
                        stdev={performanceProfile[k].sd}
                        title={k}
                        height={150}
                        key={k} />
                ))}
            </div>
        </div>
    );
}
