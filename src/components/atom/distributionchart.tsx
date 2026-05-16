import { useMemo, type JSX } from "react";
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    ReferenceDot,
    ReferenceLine,
} from "recharts";

function normalPDF(x: number, mu: number, sigma: number) {
    return (
        (1 / (sigma * Math.sqrt(2 * Math.PI))) *
        Math.exp(-0.5 * Math.pow((x - mu) / sigma, 2))
    );
}

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
    value: number;
    mean: number;
    stdev: number;
    title: string;
    height: number;
}

export default function DistributionChart({
    value,
    mean,
    stdev,
    title,
    height,
}: DistributionChartProps): JSX.Element {
    const data = useMemo(
        () => generateCurve(),
        []
    );

    const zScore = useMemo(() => {
        if (stdev === 0) return 0;

        return (value - mean) / stdev;
    }, [value, mean, stdev]);

    const percentile = useMemo(
        () => normalCDF(zScore, 0, 1),
        [zScore]
    );

    const playerY = useMemo(() => {
        return normalPDF(zScore, 0, 1);
    }, [zScore]);

    const xticks = [-2, -1, 0, 1, 2];

    return (
        <div style={{ width: "100%", height }}>
            <ResponsiveContainer >
                <AreaChart data={data}>
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
                        formatter={(v: any) => Number(v).toFixed(4)}
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
                    <ReferenceDot
                        x={zScore}
                        y={playerY}
                        r={6}
                        fill="red"
                        stroke="white"
                    />

                    <ReferenceLine x={zScore} stroke="red" />
                </AreaChart>
            </ResponsiveContainer>

            <div style={{ marginTop: 8 }}>
                <strong>{title}</strong>{" "}
                • Percentile: {(percentile * 100).toFixed(1)}%
            </div>
        </div >
    );
}
