import { useMemo, type JSX } from "react";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { LerpColor } from "../../utils/colors";
import { formatCompact } from "../../utils/format";

interface SeriesPoint {
    name: string;
    value: number;
}
interface PieChartProps {
    title: string;
    data: SeriesPoint[];
    colorRange: { from: string, to: string };
}

export default function NwsPieChart({ title, data, colorRange }: PieChartProps): JSX.Element {
    const chartData = useMemo(() => {
        const x = data.map(v => ({ name: v.name, value: v.value }));

        x.sort((a, b) => {
            const aIsNum = !isNaN(Number(a.name));
            const bIsNum = !isNaN(Number(b.name));

            // both numeric → numeric sort
            if (aIsNum && bIsNum) {
                return Number(a.name) - Number(b.name);
            }

            // only a is numeric → a comes first
            if (aIsNum && !bIsNum) return -1;

            // only b is numeric → b comes first
            if (!aIsNum && bIsNum) return 1;

            // both strings → alphabetical
            return a.name.localeCompare(b.name);
        });

        return x;
    }, [data]);

    return (
        <div>
            <h3 className="text-center">{title}</h3>
            <ResponsiveContainer width="100%" height={300}>
                <PieChart >
                    <Pie
                        data={chartData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        label={({ name, value }) =>
                            `${name}: ${formatCompact(value)}`
                        }
                        outerRadius={100}
                    >
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
                    </Pie>

                    <Tooltip />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div >
    );
}
