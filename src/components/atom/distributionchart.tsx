import { useMemo, type JSX } from "react";
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    ReferenceDot,
    ReferenceLine,
    Tooltip,
} from "recharts";
import { formatPercent } from "../../utils/format";
import { CircleIcon } from "@phosphor-icons/react";

function normalPDF(x: number, mu: number, sigma: number) {
    return (
        (1 / (sigma * Math.sqrt(2 * Math.PI))) *
        Math.exp(-0.5 * Math.pow((x - mu) / sigma, 2))
    );
}
type ValuePoint = {
    name: string;
    value: number;
    color: string;
};
// Approx normal CDF (for percentile)
function erf(x: number) {
    // Abramowitz and Stegun approximation
    const sign = x >= 0 ? 1 : -1;
    x = Math.abs(x);

    const a1 = 0.254829592;
    const a2 = -0.284496736;
    const a3 = 1.421413741;
    const a4 = -1.453152027;
    const a5 = 1.061405429;
    const p = 0.3275911;

    const t = 1 / (1 + p * x);
    const y =
        1 -
        (((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t) *
        Math.exp(-x * x);

    return sign * y;
}

function normalCDF(x: number, mu: number, sigma: number) {
    return 0.5 * (1 + erf((x - mu) / (sigma * Math.sqrt(2))));
}

function generateCurve(steps = 60) {
    const min = -3;
    const max = 3;

    const step = (max - min) / steps;

    const data = [];

    for (let i = 0; i <= steps; i++) {
        const z = min + i * step;

        data.push({
            z,
            y: normalPDF(z, 0, 1),
        });
    }

    return data;
}

interface DistributionChartProps {
    values: ValuePoint[];
    mean: number;
    stdev: number;
    title: string;
    height: number;
}

export default function DistributionChart({
    values,
    mean,
    stdev,
    title,
    height,
}: DistributionChartProps): JSX.Element {
    const data = useMemo(
        () => generateCurve(),
        []
    );
    const zScores = useMemo(() => {
        if (stdev === 0) return [0];

        return values.map(v => (v.value - mean) / stdev);
    }, [values, mean, stdev]);

    // const percentiles = useMemo(() => {
    //     return zScores.map(z => normalCDF(z, 0, 1));
    // }, [zScores]);

    const points = useMemo(() => {
        return values.map(v => {
            const z =
                stdev === 0 ? 0 : (v.value - mean) / stdev;

            return {
                ...v,
                z,
                y: normalPDF(z, 0, 1),
                percentile: normalCDF(z, 0, 1),
            };
        });
    }, [values, mean, stdev]);

    const xticks = [-2, -1, 0, 1, 2];

    return (
        <div>
            <h1>{title.substring(0, 1).toUpperCase() + title.substring(1)}</h1>
            <div style={{ width: "100%", height }}>
                <ResponsiveContainer >
                    <AreaChart data={data} onMouseMove={() => { }}>
                        <XAxis
                            dataKey="z"
                            type="number"
                            domain={[-3, 3]}
                            ticks={xticks}
                            tickFormatter={(v: number) => {
                                if (v === 0) return "μ";
                                if (v > 0) return `+${v}σ`;
                                return `${v}σ`;
                            }}
                        />
                        <YAxis hide />


                        <Tooltip
                            content={({ active }) => {
                                if (!active) return null;

                                return (
                                    <div
                                        className="
                                        rounded-lg
                                        border border-border
                                        bg-surface-1
                                        px-3 py-2
                                        text-sm
                                        shadow-md
                                    "
                                    >
                                        <div>
                                            Z-score: {points.map(v => {
                                                return (
                                                    <span key={v.name} className="flex flex-row items-center">
                                                        <CircleIcon style={{ color: v.color }} weight="fill" />
                                                        {v.z.toFixed(2)}
                                                    </span>
                                                );
                                            })}
                                        </div>

                                        <div>
                                            Percentile: {points.map(v => {
                                                return (
                                                    <span key={v.name} className="flex flex-row items-center">
                                                        <CircleIcon style={{ color: v.color }} weight="fill" />
                                                        {formatPercent(v.percentile, 1)}
                                                    </span>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            }}
                        />

                        {/* Distribution */}
                        <Area
                            type="monotone"
                            dataKey="y"
                            stroke="#4f46e5"
                            fill="#4f46e5"
                            fillOpacity={0.2}
                        />

                        {/* Player marker */}
                        {points.map((p) => (
                            <ReferenceDot
                                key={p.name}
                                x={p.z}
                                y={p.y}
                                r={6}
                                fill={p.color}
                                stroke="white"
                                style={{ cursor: "pointer" }}
                            />
                        ))}

                        {zScores.map((z, i) => (
                            <ReferenceLine key={i} x={z} stroke="red" />
                        ))}
                    </AreaChart>
                </ResponsiveContainer>
            </div >
        </div>
    );
}
