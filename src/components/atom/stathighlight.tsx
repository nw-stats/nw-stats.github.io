import type { JSX } from "react";

interface StatHighlightProps {
    title: string,
    text: string | JSX.Element,
    subtext?: string,
}

function StatHighlight({ title, text, subtext }: StatHighlightProps): JSX.Element {
    return (
        <div className="flex items-center gap-4 w-full h-full bg-gray-700 rounded-lg p-2">
            <div className="flex flex-col justify-center text-white text-sm">
                <span className="text-gray-400 font-semibold" title="Assists">{title}</span>
                <span className="text-lg font-bold">{text}</span>
                {subtext && <span className="text-xs text-gray-400 font-semibold mt-1">{subtext}</span>}
            </div>
        </div>

    );
}

export default StatHighlight;
