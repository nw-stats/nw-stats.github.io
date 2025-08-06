import type { JSX } from "react";

interface StatHighlightProps {
    title: string,
    text: string | JSX.Element,
    subtext?: string,
}

function TrackerGgStyleHighlight({ title, text, subtext }: StatHighlightProps): JSX.Element {
    return (
        <div className="flex items-center gap-4 w-fit">
            <div
                className="relative w-2 h-24 bg-gray-800 rounded overflow-hidden">
                <div
                    className="absolute bottom-0 left-0 w-full bg-gray-700"
                    style={{ height: '100%' }}
                ></div>
            </div>

            <div className="flex flex-col justify-center text-white text-sm">
                <span className="text-gray-400 font-semibold" title="Assists">{title}</span>
                <span className="text-lg font-bold">{text}</span>
                {subtext && <span className="text-xs text-gray-400 font-semibold mt-1">{subtext}</span>}
            </div>
        </div>

    );
}

export default TrackerGgStyleHighlight;
