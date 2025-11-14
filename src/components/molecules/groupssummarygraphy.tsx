import { useMemo, useState, type JSX } from "react";
import type { GroupKey } from "../../types/roster";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { companyGroupSummary, joinedRoster, splitRoster } from "../../utils/groups";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { GroupPerformance, StatTotals } from "../../types/leaderboard";
import { MultiselectDropdown } from "../atom/multiselectdropdown";

const labels = ["Kills", "Deaths", "Assists", "Healing", "Damage", "Score"];

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
            <div className="w-32">
                <MultiselectDropdown
                    name="graphs"
                    options={labels}
                    value={shownGraphs}
                    onChange={setShowGraphs}
                />
            </div >
            <div className="grid grid-cols-3 w-full"> {/* full width, fixed height */}
                {shownGraphs.includes("Kills") && <div>
                    <h3 className="text-center">Kills</h3>
                    < ResponsiveContainer width="100%" height={256}>
                        <BarChart data={data.map((v, i) => ({ name: `G${i + 1}`, value: v.kills }))}>
                            <XAxis dataKey="name" interval={0} tick={{ fill: '#fff', fontSize: 12 }} />
                            <YAxis tick={{ fill: '#fff', fontSize: 12 }} tickFormatter={(value) => {
                                if (value >= 1_000_000) return (value / 1_000_000).toFixed(1) + "M";
                                if (value >= 1_000) return (value / 1_000).toFixed(1) + "K";
                                return value;
                            }} />
                            <Tooltip />
                            <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                            <Bar dataKey="value" fill="#c70036" />
                        </BarChart>
                    </ResponsiveContainer >
                </div >}
                {shownGraphs.includes("Deaths") && <div>
                    <h3 className="text-center">Deaths</h3>
                    <ResponsiveContainer width="100%" height={256}>
                        <BarChart data={data.map((v, i) => ({ name: `G${i + 1}`, value: v.deaths }))}>
                            <XAxis dataKey="name" interval={0} tick={{ fill: '#fff', fontSize: 12 }} />
                            <YAxis tick={{ fill: '#fff', fontSize: 12 }} tickFormatter={(value) => {
                                if (value >= 1_000_000) return (value / 1_000_000).toFixed(1) + "M";
                                if (value >= 1_000) return (value / 1_000).toFixed(1) + "K";
                                return value;
                            }} />
                            <Tooltip />
                            <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                            <Bar dataKey="value" fill="#c70036" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>}
                {shownGraphs.includes("Assists") && <div>
                    <h3 className="text-center">Assists</h3>
                    <ResponsiveContainer width="100%" height={256}>
                        <BarChart data={data.map((v, i) => ({ name: `G${i + 1}`, value: v.assists }))}>
                            <XAxis dataKey="name" interval={0} tick={{ fill: '#fff', fontSize: 12 }} />
                            <YAxis tick={{ fill: '#fff', fontSize: 12 }} tickFormatter={(value) => {
                                if (value >= 1_000_000) return (value / 1_000_000).toFixed(1) + "M";
                                if (value >= 1_000) return (value / 1_000).toFixed(1) + "K";
                                return value;
                            }} />
                            <Tooltip />
                            <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                            <Bar dataKey="value" fill="#c70036" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>}
                {shownGraphs.includes("Healing") && <div>
                    <h3 className="text-center">Healing</h3>
                    <ResponsiveContainer width="100%" height={256}>
                        <BarChart data={data.map((v, i) => ({ name: `G${i + 1}`, value: v.healing }))}>
                            <XAxis dataKey="name" interval={0} tick={{ fill: '#fff', fontSize: 12 }} />
                            <YAxis tick={{ fill: '#fff', fontSize: 12 }} tickFormatter={(value) => {
                                if (value >= 1_000_000) return (value / 1_000_000).toFixed(1) + "M";
                                if (value >= 1_000) return (value / 1_000).toFixed(1) + "K";
                                return value;
                            }} />
                            <Tooltip />
                            <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                            <Bar dataKey="value" fill="#c70036" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>}
                {shownGraphs.includes("Damage") && <div>
                    <h3 className="text-center">Damage</h3>
                    <ResponsiveContainer width="100%" height={256}>
                        <BarChart data={data.map((v, i) => ({ name: `G${i + 1}`, value: v.damage }))}>
                            <XAxis dataKey="name" interval={0} tick={{ fill: '#fff', fontSize: 12 }} />
                            <YAxis tick={{ fill: '#fff', fontSize: 12 }} tickFormatter={(value) => {
                                if (value >= 1_000_000) return (value / 1_000_000).toFixed(1) + "M";
                                if (value >= 1_000) return (value / 1_000).toFixed(1) + "K";
                                return value;
                            }} />
                            <Tooltip />
                            <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                            <Bar dataKey="value" fill="#c70036" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>}
                {shownGraphs.includes("Score") && <div>
                    <h3 className="text-center">Score</h3>
                    <ResponsiveContainer width="100%" height={256}>
                        <BarChart data={data.map((v, i) => ({ name: `G${i + 1}`, value: v.score }))}>
                            <XAxis dataKey="name" interval={0} tick={{ fill: '#fff', fontSize: 12 }} />
                            <YAxis tick={{ fill: '#fff', fontSize: 12 }} tickFormatter={(value) => {
                                if (value >= 1_000_000) return (value / 1_000_000).toFixed(1) + "M";
                                if (value >= 1_000) return (value / 1_000).toFixed(1) + "K";
                                return value;
                            }} />
                            <Tooltip />
                            <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                            <Bar dataKey="value" fill="#c70036" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>}
            </div >
        </>
    );
}
