import type { JSX } from "react";

interface WinLossChartProps {
    dates: Date[];
    wins: boolean[];
}

function WinLossChart({ dates, wins }: WinLossChartProps): JSX.Element {
    return (
        <div className="flex gap-1 w-full overflow-x-auto">
            {wins.map((isWin, index) => (
                <div key={index} className="flex flex-col items-center">
                    <div
                        title={dates[index].toLocaleDateString()}
                        className={`h-40 w-12 rounded ${isWin ? "bg-blue-800" : "bg-red-800"}`}
                    ></div>
                    <div className="text-xs text-gray-400 truncate text-center w-full">
                        {dates[index].getMonth() + 1}/{dates[index].getDate()}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default WinLossChart;
