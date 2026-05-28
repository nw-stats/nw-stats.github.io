import { useMemo, useState, type JSX } from "react";
import CharacterCard from "./charactercard";
import CharacterSummary from "../molecules/playersummary";
import CharacterWarHistory from "./characterwarhistory";
import type { CharacterDetails } from "../../types/characterdetails";
import PlayerCharts from "./playercharts";
import { formatDate } from "../../utils/format";
import Dropdown from "../atom/dropdown";
import { useMeanStdev } from "../../hooks/useMeanStdev";
import Loading from "../atom/loading";
import { StatDistributionSet } from "../molecules/statdistributionset";
import { isRole } from "../../types/role";
import { useSearchParams } from "react-router-dom";

interface CharacterDetailsProps {
    details: CharacterDetails;
}
interface SeriesPoint {
    name: string;
    value: number;
}
export default function CharacterDetailsDisplay({ details }: CharacterDetailsProps): JSX.Element {
    const [searchParams, setSearchParams] = useSearchParams();
    const { loading, error, zscore } = useMeanStdev();
    const [lastN, setLastN] = useState<string>('All');
    const role = searchParams.get("role") ?? "All";
    const setRole = (role: string) => {
        setSearchParams(prev => {
            const next = new URLSearchParams(prev);
            next.set("role", role);
            return next;
        });
    }
    const options = useMemo(() => {
        const s = new Set<string>();
        for (const entry of details.history) {
            s.add(entry.roleAssignment.role);
        }
        return ['All', ...Array.from(s)];
    }, [details]);

    const filteredHistory = useMemo(() => (
        details.history.filter((v) => (
            v.roleAssignment.role === role || role === 'All'
        ))), [details, role]);

    const series: Record<string, SeriesPoint[]> = useMemo(() => {
        const sorted = filteredHistory.sort((a, b) => a.date.toMillis() - b.date.toMillis());
        const iLastN = Number(lastN)
        console.log(iLastN);
        const lastTen = lastN === 'All'
            ? sorted
            : sorted.length > iLastN
                ? sorted.slice(-iLastN)
                : sorted;

        const s = {
            scores: lastTen.map(a => ({ name: formatDate(a.date), value: a.score })),
            kills: lastTen.map(a => ({ name: formatDate(a.date), value: a.kills })),
            deaths: lastTen.map(a => ({ name: formatDate(a.date), value: a.deaths })),
            assists: lastTen.map(a => ({ name: formatDate(a.date), value: a.assists })),
            healing: lastTen.map(a => ({ name: formatDate(a.date), value: a.healing })),
            damage: lastTen.map(a => ({ name: formatDate(a.date), value: a.damage })),
        };
        return s;
    }, [filteredHistory, lastN]);

    const zScoreSeries = useMemo(() => {
        return [
            {
                name: details.character.name,
                value: details.normalized,
                color: "blue",
            }
        ]
    }, [details.character.name, details.normalized]);
    if (loading) return <Loading />
    if (error) return <></>

    return (
        <div>
            <div className="flex flex-col max-w-6xl mx-auto gap-3">
                <CharacterCard player={details.character} />
                <CharacterSummary
                    character={details.character}
                    summary={details.totals}
                    averages={details.normalized}
                />
                <div className="p-3 border-b border-border">
                    <h1 className="text-foreground font-semibold">
                        Role
                    </h1>
                    <Dropdown options={options} value={role} onChange={setRole} />
                </div>
                <div className="p-3 border-b border-border">
                    <h1 className="text-foreground font-semibold">
                        Look at this Graph
                    </h1>
                </div>
                <div className="flex flex-row">
                    <Dropdown options={['All', `10`, `5`, `1`]} value={lastN} onChange={setLastN} />
                </div>
                <PlayerCharts scores={series.scores} kills={series.kills} deaths={series.deaths} assists={series.assists} healing={series.healing} damage={series.damage} />
                <div className="p-4 border-b border-border">
                    Distribution
                </div>
                <div className="mb-8">
                    {isRole(role)
                        && <StatDistributionSet
                            performanceProfile={zscore[role]}
                            playerPerformance={zScoreSeries} />}
                </div>
                <div className="p-3 border-b border-border">
                    <h1 className="text-foreground font-semibold">
                        War History
                    </h1>
                </div>
                <CharacterWarHistory history={filteredHistory} />

            </div>
        </div>
    );
}
