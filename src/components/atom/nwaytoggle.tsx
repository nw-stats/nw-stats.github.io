import { useState } from "react";
import type { JSX } from "react";

interface NWayToggleProps<T extends string> {
    options: T[];
    defaultValue?: T;
    onChange?: (value: T, index: number) => void;
    className?: string;
    disabled?: boolean;
}

export function NWayToggle<T extends string>({
    options,
    defaultValue,
    onChange,
    className,
    disabled,
}: NWayToggleProps<T>): JSX.Element {
    const defaultIndex = defaultValue ? options.indexOf(defaultValue) : 0;
    const [selectedIndex, setSelectedIndex] = useState(defaultIndex);

    // useEffect(() => {
    //     if (defaultValue) {
    //         const index = options.indexOf(defaultValue);
    //         if (index >= 0) setSelectedIndex(index);
    //     }
    // }, [defaultValue, options]);

    const handleClick = (index: number) => {
        if (disabled) return;
        setSelectedIndex(index);
        onChange?.(options[index], index);
    };



    return (
        <div className="flex">
            {options.map((option, index) => (
                <button
                    key={index}
                    onClick={() => handleClick(index)}
                    className={`${className} ${disabled ? 'bg-gray-700 text-gray-400'
                        : selectedIndex === index
                            ? "bg-blue-600"
                            : "bg-gray-600 hover:bg-gray-700"
                        } ${index === 0
                            ? 'rounded-l-lg'
                            : index === options.length - 1
                                ? 'rounded-r-lg'
                                : ''}`}
                >
                    {option}
                </button>
            ))
            }
        </div >
    );
}
