import type { JSX } from "react";

interface FitTextToCellProps {
    text: string
}
function FitTextToCell({ text }: FitTextToCellProps): JSX.Element {
    return (
        <span className="block text-center text-wrap overflow-clip">{text}</span>
    );
}

export default FitTextToCell;
