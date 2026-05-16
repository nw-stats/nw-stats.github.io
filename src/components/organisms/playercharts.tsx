import { useMemo, type JSX } from "react";
import { BarGraph } from "../atom/bargraph";

type SeriesPoint = {
    name: string;
    value: number;
};

interface PlayerChartProps {
    scores: SeriesPoint[];
    kills: SeriesPoint[];
    deaths: SeriesPoint[];
    assists: SeriesPoint[];
    healing: SeriesPoint[];
    damage: SeriesPoint[];
};

export default function PlayerCharts({
    scores,
    kills,
    deaths,
    assists,
    healing,
    damage,
}: PlayerChartProps): JSX.Element {
    const averages = useMemo(() => {
        const l = scores.length;
        return {
            scores: scores.reduce((p, c) => (p + c.value), 0) / l,
            kills: kills.reduce((p, c) => (p + c.value), 0) / l,
            deaths: deaths.reduce((p, c) => (p + c.value), 0) / l,
            assists: assists.reduce((p, c) => (p + c.value), 0) / l,
            healing: healing.reduce((p, c) => (p + c.value), 0) / l,
            damage: damage.reduce((p, c) => (p + c.value), 0) / l,
        }
    }, [scores, kills, deaths, assists, healing, damage]);

    const series = useMemo(() => ({
        scores: [{ key: 'scores', label: 'scores', color: '#', }],
        kills: [{ key: 'kills', label: 'kills', color: '#', }],
        deaths: [{ key: 'deaths', label: 'deaths', color: '#', }],
        assists: [{ key: 'assists', label: 'assists', color: '#', }],
        healing: [{ key: 'healing', label: 'healing', color: '#', }],
        damage: [{ key: 'damage', label: 'damage', color: '#', }],
    }), []);

    return (
        <div className="w-full bg-surface-">
            <div className="w-full grid grid-cols-1 md:grid-cols-3">
                <BarGraph title={"Scores"} data={scores} lines={[averages.scores,]} series={series.scores} />
                <BarGraph title={"Kills"} data={kills} lines={[averages.kills,]} series={series.kills} />
                <BarGraph title={"Deaths"} data={deaths} lines={[averages.deaths,]} series={series.deaths} />
                <BarGraph title={"Assists"} data={assists} lines={[averages.assists,]} series={series.assists} />
                <BarGraph title={"Healing"} data={healing} lines={[averages.healing,]} series={series.healing} />
                <BarGraph title={"Damage"} data={damage} lines={[averages.damage,]} series={series.damage} />
            </div>
        </div>
    );
}
