// import { useState, type JSX } from "react";

// interface HeatMapCell {
//     attacker: number;
//     defender: number;
// }

// interface HeatmapRegion extends HeatMapCell {
//     color: string;
// }

// type RegionKey =
//     | "point"
//     | "Top Strong"
//     | "Top Weak"
//     | "Bottom Strong"
//     | "Bottom Weak"
//     | "Weak"
//     | "Strong"
//     | "Outer"
//     | "Wide";

// interface HoverState {
//     key: RegionKey;
//     data: HeatmapRegion;
// }

// interface HeatmapProps {
//     point: HeatmapRegion;
//     topLeft: HeatmapRegion;
//     topRight: HeatmapRegion;
//     bottomLeft: HeatmapRegion;
//     bottomRight: HeatmapRegion;
//     weak: HeatmapRegion;
//     strong: HeatmapRegion;
//     outer: HeatmapRegion;
//     wide: HeatmapRegion;
// }

// function Heatmap({
//     point,
//     topLeft,
//     topRight,
//     bottomLeft,
//     bottomRight,
//     weak,
//     strong,
//     outer,
//     wide
// }: HeatmapProps): JSX.Element {

//     const [hover, setHover] = useState<HoverState | null>(null);

//     const stroke = "#000000";
//     const strokeWidth = 6;

//     const regionProps = (key: RegionKey, r: HeatmapRegion) => ({
//         fill: r.color,
//         stroke,
//         strokeWidth,
//         strokeLinejoin: "round" as const,
//         onMouseEnter: () => setHover({ key, data: r }),
//         onMouseLeave: () => setHover(null),
//     });

//     const Tooltip = () => {
//         if (!hover) return null;

//         const net = hover.data.attacker - hover.data.defender;

//         return (
//             <foreignObject x="10" y="10" width="220" height="150">
//                 <div className="bg-surface-2/50 backdrop-blur-md rounded-lg border border-border p-2 shadow">

//                     {/* centered label */}
//                     <div className="text-xs font-semibold text-center capitalize">
//                         {hover.key}
//                     </div>

//                     {/* divider */}
//                     <div className="my-2 h-px bg-border opacity-60" />

//                     {/* table */}
//                     <div className="grid grid-cols-2 text-sm font-mono">
//                         <div>Attacker</div>
//                         <div className="text-right">{hover.data.attacker}</div>

//                         <div>Defender</div>
//                         <div className="text-right">{hover.data.defender}</div>

//                         <div>Net</div>
//                         <div className="text-right">{net}</div>
//                     </div>
//                 </div>
//             </foreignObject>
//         );
//     };

//     return (
//         <svg
//             width="50%"
//             height="100%"
//             viewBox="0 0 400 400"
//             xmlns="http://www.w3.org/2000/svg"
//         >
//             <path
//                 d="M68.633,68.633c-72.552,72.552 -72.552,190.182 0,262.734l131.367,-131.367l-131.367,-131.367Z"
//                 {...regionProps("Wide", wide)}
//             />

//             <path
//                 d="M94.907,94.907c-58.042,58.041 -58.042,152.145 -0,210.186l105.093,-105.093l-105.093,-105.093Z"
//                 {...regionProps("Outer", outer)}
//             />

//             <path
//                 d="M121.18,121.18c-43.531,43.531 -43.531,114.109 -0,157.64l78.82,-78.82l-78.82,-78.82Z"
//                 {...regionProps("Strong", strong)}
//             />

//             <path
//                 d="M278.82,278.82c43.531,-43.531 43.531,-114.109 0,-157.64l-78.82,78.82l78.82,78.82Z"
//                 {...regionProps("Weak", weak)}
//             />

//             <path
//                 d="M125.688,200c-0,41.042 33.27,74.312 74.312,74.312l0,-74.312l-74.312,0Z"
//                 {...regionProps("Bottom Strong", bottomLeft)}
//             />

//             <path
//                 d="M200,125.688c-41.042,-0 -74.312,33.27 -74.312,74.312l74.312,0l0,-74.312Z"
//                 {...regionProps("Top Strong", topLeft)}
//             />

//             <path
//                 d="M200,274.312c41.042,0 74.312,-33.27 74.312,-74.312l-74.312,0l0,74.312Z"
//                 {...regionProps("Bottom Weak", bottomRight)}
//             />

//             <path
//                 d="M274.312,200c0,-41.042 -33.27,-74.312 -74.312,-74.312l0,74.312l74.312,0Z"
//                 {...regionProps("Top Weak", topRight)}
//             />

//             <circle
//                 cx="200"
//                 cy="200"
//                 r="37.156"
//                 fill={point.color}
//                 stroke={stroke}
//                 strokeWidth={strokeWidth}
//                 onMouseEnter={() => setHover({ key: "point", data: point })}
//                 onMouseLeave={() => setHover(null)}
//             />

//             <Tooltip />
//         </svg>
//     );
// }

// export default Heatmap;
import { useState, type JSX } from "react";

interface HeatMapCell {
    attacker: number;
    defender: number;
}

interface HeatmapRegion extends HeatMapCell {
    color: string;
}

type RegionKey =
    | "point"
    | "Top Strong"
    | "Top Weak"
    | "Bottom Strong"
    | "Bottom Weak"
    | "Weak"
    | "Strong"
    | "Outer"
    | "Wide";

interface HoverState {
    key: RegionKey;
    data: HeatmapRegion;
}

interface HeatmapProps {
    point: HeatmapRegion;
    topLeft: HeatmapRegion;
    topRight: HeatmapRegion;
    bottomLeft: HeatmapRegion;
    bottomRight: HeatmapRegion;
    weak: HeatmapRegion;
    strong: HeatmapRegion;
    outer: HeatmapRegion;
    wide: HeatmapRegion;
    attackerColor: string;
    defenderColor: string;
    neutralColor: string;
    attackerName: string;
    defenderName: string;
}

function Heatmap({
    point,
    topLeft,
    topRight,
    bottomLeft,
    bottomRight,
    weak,
    strong,
    outer,
    wide,
    attackerColor,
    defenderColor,
    neutralColor,
    attackerName,
    defenderName,
}: HeatmapProps): JSX.Element {

    const [hover, setHover] = useState<HoverState | null>(null);

    const stroke = "#000000";
    const strokeWidth = 6;

    const regionProps = (key: RegionKey, r: HeatmapRegion) => ({
        fill: r.color,
        stroke,
        strokeWidth,
        strokeLinejoin: "round" as const,
        onMouseEnter: () => setHover({ key, data: r }),
        onMouseLeave: () => setHover(null),
    });

    const Tooltip = () => {
        if (!hover) return null;

        const net = hover.data.attacker - hover.data.defender;

        return (
            <foreignObject x="10" y="10" width="220" height="150">
                <div className="bg-surface-2/50 backdrop-blur-md rounded-lg border border-border p-2 shadow">

                    <div className="text-xs font-semibold text-center capitalize">
                        {hover.key}
                    </div>

                    <div className="my-2 h-px bg-border opacity-60" />

                    <div className="grid grid-cols-2 text-sm font-mono">
                        <div>{attackerName}</div>
                        <div className="text-right">{hover.data.attacker}</div>

                        <div>{defenderName}</div>
                        <div className="text-right">{hover.data.defender}</div>

                        <div>Net</div>
                        <div className="text-right">{net}</div>
                    </div>
                </div>
            </foreignObject>
        );
    };
    const Legend = () => {
        return (
            <div className="flex flex-col items-center bg-surface-2/30 backdrop-blur-md border border-border rounded-lg p-3">

                <div className="flex items-center gap-3">

                    {/* labels */}
                    <div className="flex flex-col justify-between h-48 text-[10px] font-mono opacity-80 text-right">
                        <span>{attackerName}</span>
                        <span>Neutral</span>
                        <span>{defenderName}</span>
                    </div>

                    {/* vertical gradient */}
                    <div
                        className="w-5 h-48 rounded-full border border-border"
                        style={{
                            background: `
                            linear-gradient(
                                to top,
                                ${defenderColor},
                                ${neutralColor},
                                ${attackerColor}
                            )
                        `
                        }}
                    />
                </div>
            </div>
        );
    };

    return (
        <div>
            {/* title */}
            <div className="text-lg font-semibold text-center">
                Pressure Heatmap
            </div>
            <div className="flex items-center justify-center gap-4 w-full h-full">
                <Legend />
                <svg
                    className="w-1/2 h-full"
                    viewBox="0 0 400 400"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path className="transition-all duration-200 hover:brightness-115"
                        d="M68.633,68.633c-72.552,72.552 -72.552,190.182 0,262.734l131.367,-131.367l-131.367,-131.367Z"
                        {...regionProps("Wide", wide)}
                    />

                    <path className="transition-all duration-200 hover:brightness-115"
                        d="M94.907,94.907c-58.042,58.041 -58.042,152.145 -0,210.186l105.093,-105.093l-105.093,-105.093Z"
                        {...regionProps("Outer", outer)}
                    />

                    <path className="transition-all duration-200 hover:brightness-115"
                        d="M121.18,121.18c-43.531,43.531 -43.531,114.109 -0,157.64l78.82,-78.82l-78.82,-78.82Z"
                        {...regionProps("Strong", strong)}
                    />

                    <path className="transition-all duration-200 hover:brightness-115"
                        d="M278.82,278.82c43.531,-43.531 43.531,-114.109 0,-157.64l-78.82,78.82l78.82,78.82Z"
                        {...regionProps("Weak", weak)}
                    />

                    <path className="transition-all duration-200 hover:brightness-115"
                        d="M125.688,200c-0,41.042 33.27,74.312 74.312,74.312l0,-74.312l-74.312,0Z"
                        {...regionProps("Bottom Strong", bottomLeft)}
                    />

                    <path className="transition-all duration-200 hover:brightness-115"
                        d="M200,125.688c-41.042,-0 -74.312,33.27 -74.312,74.312l74.312,0l0,-74.312Z"
                        {...regionProps("Top Strong", topLeft)}
                    />

                    <path className="transition-all duration-200 hover:brightness-115"
                        d="M200,274.312c41.042,0 74.312,-33.27 74.312,-74.312l-74.312,0l0,74.312Z"
                        {...regionProps("Bottom Weak", bottomRight)}
                    />

                    <path className="transition-all duration-200 hover:brightness-115"
                        d="M274.312,200c0,-41.042 -33.27,-74.312 -74.312,-74.312l0,74.312l74.312,0Z"
                        {...regionProps("Top Weak", topRight)}
                    />

                    <circle
                        className="transition-all duration-200 hover:brightness-115"
                        cx="200"
                        cy="200"
                        r="37.156"
                        fill={point.color}
                        stroke={stroke}
                        strokeWidth={strokeWidth}
                        onMouseEnter={() => setHover({ key: "point", data: point })}
                        onMouseLeave={() => setHover(null)}
                    />

                    <Tooltip />
                </svg>
            </div>
        </div>
    );
}

export default Heatmap;
