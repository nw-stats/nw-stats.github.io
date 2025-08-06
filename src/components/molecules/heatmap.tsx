import type { JSX } from "react";

interface HeatmapProps {
    point: string;
    topLeft: string;
    topRight: string;
    bottomLeft: string;
    bottomRight: string;
    weak: string;
    strong: string;
    outer: string;
    wide: string;
}

function Heatmap({ point, topLeft, topRight, bottomLeft, bottomRight, weak, strong, outer, wide }: HeatmapProps): JSX.Element {

    return (
        <svg width="50%" height="100%" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
            <path d="M68.633,68.633c-72.552,72.552 -72.552,190.182 0,262.734l131.367,-131.367l-131.367,-131.367Z" fill={wide} />
            <path d="M94.907,94.907c-58.042,58.041 -58.042,152.145 -0,210.186l105.093,-105.093l-105.093,-105.093Z" fill={outer} />
            <path d="M121.18,121.18c-43.531,43.531 -43.531,114.109 -0,157.64l78.82,-78.82l-78.82,-78.82Z" fill={strong} />
            <path d="M278.82,278.82c43.531,-43.531 43.531,-114.109 0,-157.64l-78.82,78.82l78.82,78.82Z" fill={weak} />
            <path d="M125.688,200c-0,41.042 33.27,74.312 74.312,74.312l0,-74.312l-74.312,0Z" fill={bottomLeft} />
            <path d="M200,125.688c-41.042,-0 -74.312,33.27 -74.312,74.312l74.312,0l0,-74.312Z" fill={topLeft} />
            <path d="M200,274.312c41.042,0 74.312,-33.27 74.312,-74.312l-74.312,0l0,74.312Z" fill={bottomRight} />
            <path d="M274.312,200c0,-41.042 -33.27,-74.312 -74.312,-74.312l0,74.312l74.312,0Z" fill={topRight} />
            <circle cx="200" cy="200" r="37.156" fill={point} />
        </svg>

    );
}

export default Heatmap;
