import type { JSX } from "react";
import StatWithIcon from "../molecules/statwithicon";
import type { CaptureTimes } from "../../types/captures";
import { formatSeconds } from "../../utils/time";

interface CaptureTimesProps {
    captures: CaptureTimes;
}
export function CaptureTimes({ captures }: CaptureTimesProps): JSX.Element {
    const pa = captures.pointA ? formatSeconds(captures.pointA) : "-";
    const pb = captures.pointB ? formatSeconds(captures.pointB) : "-";
    const pc = captures.pointC ? formatSeconds(captures.pointC) : "-";
    const pf = captures.fort ? formatSeconds(captures.fort) : "-";
    return (
        <div className="flex flex-col text-white">
            <span className="text-sm text-centers">Captures</span>
            <div className="grid grid-cols-4 place-items-center w-full text-white text-sm">
                <StatWithIcon icon={<div>A</div>} value={pa} />
                <StatWithIcon icon={<div>B</div>} value={pb} />
                <StatWithIcon icon={<div>C</div>} value={pc} />
                <StatWithIcon icon={<div>Fort</div>} value={pf} />
            </div>
        </div>
    );
}
