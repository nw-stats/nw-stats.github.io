import { useState } from "react";
import type { JSX } from "react";

interface NWayToggleProps {
    options: string[];
    defaultIndex?: number;
    onChange?: (value: string, index: number) => void;
}

export function NWayToggle({
    options,
    defaultIndex = 0,
    onChange,
}: NWayToggleProps): JSX.Element {
    const [selectedIndex, setSelectedIndex] = useState(defaultIndex);

    const handleClick = (index: number) => {
        setSelectedIndex(index);
        onChange?.(options[index], index);
    };

    return (
        <div className="flex gap-2">
            {options.map((option, index) => (
                <button
                    key={option}
                    onClick={() => handleClick(index)}
                    className={`px-3 py-1 rounded ${selectedIndex === index
                        ? "bg-blue-500 text-white"
                        : "bg-gray-300 text-black"
                        }`}
                >
                    {option}
                </button>
            ))}
        </div>
    );
}
