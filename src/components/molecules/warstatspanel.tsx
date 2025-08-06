import type { CaptureTimes } from "../../types/captures";
import StatWithIcon from "./statwithicon";
import { formatDate, formatSeconds } from "../../utils/time";

interface WarStatsPanelProps {
    date: Date;
    map: string;
    captures: CaptureTimes
}

const WarStatsPanel: React.FC<WarStatsPanelProps> = ({ date, map, captures }) => {
    const pa = captures.pointA ? formatSeconds(captures.pointA) : "-";
    const pb = captures.pointB ? formatSeconds(captures.pointB) : "-";
    const pc = captures.pointC ? formatSeconds(captures.pointC) : "-";
    const pf = captures.fort ? formatSeconds(captures.fort) : "-";

    return (
        <div className="bg-gray-800 text-white text-lg rounded-lg p-5">
            <div className="grid grid-cols-1 gap-0">

                {/* Left side: map + date */}
                <div className="grid grid-rows-2 place-items-center w-full">
                    <div className="font-bold text-3xl">{map}</div>
                    <div className="text-sm">{formatDate(date)}</div>
                </div>

                {/* Right side: captures */}
                <div className="grid grid-cols-4 place-items-center w-full">
                    <StatWithIcon icon={<div>A</div>} value={pa} />
                    <StatWithIcon icon={<div>B</div>} value={pb} />
                    <StatWithIcon icon={<div>C</div>} value={pc} />
                    <StatWithIcon icon={<div>Fort</div>} value={pf} />
                </div>

            </div>
        </div>
    );

    // return (
    //     <div className="bg-gray-800 text-white rounded-lg p-2 space-y-0">
    //         <div className="grid sm:grid-cols-1 md:grid-cols-2 w-full gap-0">

    //             {/* Left side: map + date */}
    //             <div className="grid grid-rows-2 place-items-center w-full">
    //                 <div className="font-bold text-3xl">{map}</div>
    //                 <div className="text-sm">{formatDate(date)}</div>
    //             </div>

    //             {/* Right side: captures */}
    //             <div className="grid grid-cols-4 place-items-center w-full">
    //                 <StatWithIcon icon={<div>A</div>} value={pa} />
    //                 <StatWithIcon icon={<div>B</div>} value={pb} />
    //                 <StatWithIcon icon={<div>C</div>} value={pc} />
    //                 <StatWithIcon icon={<div>Fort</div>} value={pf} />
    //             </div>

    //         </div>
    //     </div>
    // );
};

export default WarStatsPanel;
