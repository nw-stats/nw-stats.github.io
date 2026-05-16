import type { JSX } from "react";
import { Bar, BarChart, CartesianGrid, LabelList, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatCompact, formatPercent } from "../../utils/format";

interface SeriesPoint {
    name: string;
    value: number;
}
interface Series {
    key: string;
    label: string;
    color: string;
}
interface BarGraphProps {
    title: string;
    data: SeriesPoint[];
    series: Series[];
    lines?: number[];
    style?: "number" | "percent"
}

export function BarGraph({ title, data, series, lines, style }: BarGraphProps): JSX.Element {
    const _style = style ? style : "number";
    return (
        <div>
            <h3 className="text-center">{title}</h3>
            < ResponsiveContainer width="100%" height={256}>
                <BarChart data={data} margin={{
                    top: 24,
                    right: 0,
                    left: 0,
                    bottom: 0
                }}>
                    <XAxis dataKey="name" interval={0} tick={{ fill: '#fff', fontSize: 12 }} />
                    <YAxis tick={{ fill: '#fff', fontSize: 12 }} tickFormatter={(value) => _style === "number" ? formatCompact(value) : formatPercent(value)} />
                    <Tooltip />
                    <CartesianGrid vertical={false} stroke="#6a7282" strokeDasharray="5 5" />
                    {(lines && lines.length > 0) && lines.map(v => (
                        <ReferenceLine
                            y={v}
                            stroke="#fbbf24"
                            strokeWidth={2}
                            strokeDasharray="6 6"
                            label={{
                                value: `Mean: ${formatCompact(v)}`,
                                position: "left",
                                fill: "#fbbf24",
                                fontSize: 12
                            }}
                        />))}
                    {series.map(s => (
                        <Bar key={s.key} dataKey={s.key} fill={s.color} radius={[6, 6, 0, 0]}>
                            <LabelList dataKey={s.key} position="top" fill="#fff" fontSize={12} formatter={(v) =>
                                _style === "number"
                                    ? formatCompact(Number(v))
                                    : formatPercent(Number(v))
                            } />
                        </Bar>
                    ))}
                    <Bar dataKey="value" fill="#1c398e">
                        <LabelList dataKey="value" position="top" fill="#fff" fontSize={12} formatter={(v) => _style === "number" ? formatCompact(Number(v)) : formatPercent(Number(v))} />
                    </Bar>
                </BarChart>
            </ResponsiveContainer >
        </div>
    );
}
