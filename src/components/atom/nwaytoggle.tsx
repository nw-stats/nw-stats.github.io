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
        <div className="flex flex-row gap-0.5">
            {options.map((option, index) => (
                <button
                    key={index}
                    onClick={() => handleClick(index)}
                    className={`border-border border-1 ${className} ${disabled ? 'bg-surface-1 text-foreground'
                        : selectedIndex === index
                            ? "bg-surface-active"
                            : "bg-surface-1 hover:bg-surface-hover"
                        } ${index === 0
                            ? 'rounded-l-full'
                            : index === options.length - 1
                                ? 'rounded-r-full'
                                : ''}`}
                >
                    {option}
                </button>
            ))
            }
        </div >
    );
}
