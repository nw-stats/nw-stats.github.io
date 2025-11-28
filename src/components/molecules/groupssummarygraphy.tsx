import { useMemo, type JSX } from "react";
import type { GroupKey } from "../../types/roster";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { companyGroupSummary, joinedRoster, splitRoster } from "../../utils/groups";
import type { GroupPerformance, StatTotals } from "../../types/leaderboard";
import { MultiselectDropdown } from "../atom/multiselectdropdown";
import { NWayToggle } from "../atom/nwaytoggle";
import { numberOrNLetters } from "../../utils/format";
import { BarGraph } from "../atom/bargraph";

const labels = ["Kills", "Deaths", "Assists", "Healing", "Damage", "KPar", "Score"];

interface GroupsSummaryProps {
    groups?: Map<GroupKey, GroupPerformance>;
}

export function GroupsSummaryGraph({ groups }: GroupsSummaryProps): JSX.Element {
    const [qdpsSplit, setQdpsSplit] = useLocalStorage<'Joined' | 'Split' | 'Both'>('qdpsSplit', 'Joined');
    const [aoeSplit, setAoeSplit] = useLocalStorage<'Include' | 'Exclude'>('aoeSplit', 'Include');
    const [shownGraphs, setShowGraphs] = useLocalStorage<string[]>('shownGraphs', labels);

    const hasQdps = useMemo(() => {
        return Array.from(groups?.keys() || []).some(v => typeof v !== 'number');
    }, [groups]);


    const splitRoles = useMemo(() => aoeSplit === 'Exclude' ? ['aoe'] : undefined, [aoeSplit]);
    const data: Array<StatTotals> = useMemo(() => {
        if (!groups) return [];
        let filteredGroups = groups;
        if (qdpsSplit === 'Joined') {
            filteredGroups = joinedRoster(groups);
        } else if (qdpsSplit === 'Split') {
            filteredGroups = splitRoster(groups);
        }

        const summary = companyGroupSummary(filteredGroups);
        if (splitRoles) {
            for (const [gk, group] of filteredGroups) {
                for (const stat of group.stats) {
                    if (stat.roleAssignment.role) {
                        if (splitRoles.some(v => stat.roleAssignment.role.toLowerCase().includes(v))) {
                            summary.get(gk)!.healing -= stat.healing;
                        }
                    }
                }
            }
        }
        return Array.from(summary.keys())
            .sort((a, b) => {
                const keyA = a;
                const keyB = b;

                // If both are numbers, sort numerically
                if (typeof keyA === 'number' && typeof keyB === 'number') {
                    return keyA - keyB;
                }

                // If one is a number and the other is a string, number comes first
                if (typeof keyA === 'number') return -1;
                if (typeof keyB === 'number') return 1;

                // If both are strings, sort 'Weak' before 'Strong'
                if (keyA === keyB) return 0;
                if (keyA === 'weak') return -1;
                return 1; // keyB === 'Weak' or keyA === 'Strong' > keyB === 'Strong'
            })
            .map(key => summary.get(key))
            .filter((item): item is StatTotals => item !== undefined);
    }, [groups, qdpsSplit, splitRoles]);

    return (
        <>
            <div className='flex flex-row items-center h-full mb-2 gap-2'>
                <span className="">QDPS arrangement</span>
                <NWayToggle
                    className="text-small px-2 py-1"
                    defaultValue={qdpsSplit}
                    options={['Joined', 'Split', 'Both']}
                    onChange={(value) =>
                        setQdpsSplit(value as 'Joined' | 'Split' | 'Both')
                    }
                    disabled={!hasQdps}
                />
                <span className="">AoE healing</span>
                <NWayToggle
                    className="text-small px-2 py-1"
                    defaultValue={aoeSplit}
                    options={['Include', 'Exclude']}
                    onChange={(value) => {
                        setAoeSplit(value as 'Include' | 'Exclude')
                    }}
                    disabled={false}
                />
            </div>
            <div className="w-32">
                <MultiselectDropdown
                    name="graphs"
                    options={labels}
                    value={shownGraphs}
                    onChange={setShowGraphs}
                />
            </div >
            <div className="grid grid-cols-1 md:grid-cols-3 w-full"> {/* full width, fixed height */}
                {shownGraphs.includes("Kills") && <div>
                    <BarGraph data={data.map((v) => (
                        { name: numberOrNLetters(v.name), value: v.kills }
                    ))} />
                </div>}
                {shownGraphs.includes("Deaths") && <div>
                    <BarGraph data={data.map((v) => (
                        { name: numberOrNLetters(v.name), value: v.deaths }
                    ))} />
                </div>}
                {shownGraphs.includes("Assists") && <div>
                    <BarGraph data={data.map((v) => (
                        { name: numberOrNLetters(v.name), value: v.assists }
                    ))} />
                </div>}
                {shownGraphs.includes("Healing") && <div>
                    <BarGraph data={data.map((v) => (
                        { name: numberOrNLetters(v.name), value: v.healing }
                    ))} />
                </div>}
                {shownGraphs.includes("Damage") && <div>
                    <BarGraph data={data.map((v) => (
                        { name: numberOrNLetters(v.name), value: v.damage }
                    ))} />
                </div>}
                {shownGraphs.includes("KPar") && <div>
                    <BarGraph data={data.map((v) => (
                        { name: numberOrNLetters(v.name), value: v.kpar }
                    ))} style="percent" />
                </div>}
                {shownGraphs.includes("Score") && <div>
                    <BarGraph data={data.map((v) => (
                        { name: numberOrNLetters(v.name), value: v.score }
                    ))} />
                </div>}
            </div >
        </>
    );
}
