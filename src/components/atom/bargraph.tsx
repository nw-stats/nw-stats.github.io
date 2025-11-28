import type { JSX } from "react";
import { Bar, BarChart, CartesianGrid, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatCompact, formatPercent } from "../../utils/format";

interface BarGraphProps {
    data: { name: string, value: number }[];
    style?: "number" | "percent"
}

export function BarGraph({ data, style }: BarGraphProps): JSX.Element {
    const _style = style ? style : "number";
    return (
        <>
            <h3 className="text-center">Kills</h3>
            < ResponsiveContainer width="100%" height={256}>
                <BarChart data={data}>
                    <XAxis dataKey="name" interval={0} tick={{ fill: '#fff', fontSize: 12 }} />
                    <YAxis tick={{ fill: '#fff', fontSize: 12 }} tickFormatter={(value) => _style === "number" ? formatCompact(value) : formatPercent(value)} />
                    <Tooltip />
                    <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                    <Bar dataKey="value" fill="#c70036">
                        <LabelList dataKey="value" position="top" fill="#fff" fontSize={12} formatter={(v) => _style === "number" ? formatCompact(Number(v)) : formatPercent(Number(v))} />
                    </Bar>
                </BarChart>
            </ResponsiveContainer >
        </>
    );
}
