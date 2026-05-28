import type { JSX } from "react";
import { Bar, BarChart, CartesianGrid, Cell, LabelList, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatCompact, formatPercent } from "../../utils/format";
import { LerpColor } from "../../utils/colors";

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
    colorRange: { from: string, to: string };
    lines?: number[];
    style?: "number" | "percent"
}

export function BarGraph({ title, data, series, colorRange, lines, style }: BarGraphProps): JSX.Element {
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
                    <Tooltip
                        cursor={{ fill: "var(--surface-hover)" }}
                        content={({ active, payload, label }) => {
                            if (!active || !payload?.length) return null;

                            return (
                                <div
                                    className="
                                        rounded-lg
                                        border border-border
                                        bg-surface-1
                                        px-3 py-2
                                        text-sm
                                        shadow-md
                                        flex flex-col gap-1
                                        "
                                >
                                    {/* x-axis label */}
                                    <div className="font-semibold text-fg border-b border-border pb-1">
                                        {label}
                                    </div>

                                    {/* values for all hovered series */}
                                    {payload.map((entry) => (
                                        <div
                                            key={entry.dataKey}
                                            className="flex items-center justify-between gap-4"
                                        >
                                            <div className="flex items-center gap-2">
                                                <div
                                                    className="size-3 rounded-sm"
                                                    style={{
                                                        background: entry.color
                                                    }}
                                                />

                                                <span className="text-muted">
                                                    {entry.name ?? entry.dataKey}
                                                </span>
                                            </div>

                                            <span className="font-medium">
                                                {_style === "number"
                                                    ? formatCompact(Number(entry.value))
                                                    : formatPercent(Number(entry.value))}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            );
                        }}
                    />
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
                        <Bar key={s.key}
                            dataKey={s.key}
                            fill={s.color}
                            radius={[6, 6, 0, 0]}>
                            <LabelList dataKey={s.key} position="top" fill="#fff" fontSize={12} formatter={(v) =>
                                _style === "number"
                                    ? formatCompact(Number(v))
                                    : formatPercent(Number(v))
                            } />
                        </Bar>
                    ))}
                    <Bar dataKey="value"
                        fill="#1c398e">
                        {data.map((_, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={LerpColor(
                                    colorRange.from,
                                    colorRange.to,
                                    data.length > 1
                                        ? index / (data.length - 1)
                                        : 1
                                )}
                            />
                        ))}
                        <LabelList dataKey="value" position="top" fill="#fff" fontSize={12} formatter={(v) => _style === "number" ? formatCompact(Number(v)) : formatPercent(Number(v))} />
                    </Bar>
                </BarChart>
            </ResponsiveContainer >
        </div>
    );
}
