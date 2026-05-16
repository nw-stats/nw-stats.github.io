import React, { useMemo } from "react";

interface TabProps {
    label: string;
    children: React.ReactNode;
}

export function Tab({ children }: TabProps) {
    return <>{children}</>;
}

interface TabbedContentProps {
    children: React.ReactNode;
    activeLabel?: string; // controlled label
    onChangeLabel?: (label: string) => void;
}

export function TabbedContent({ children, activeLabel, onChangeLabel }: TabbedContentProps) {
    const childrenArray = React.Children.toArray(children) as React.ReactElement<TabProps>[];
    const labels: string[] = useMemo(() => {
        const l: string[] = []
        for (const child of childrenArray) {
            const childLabel = child.props.label;
            if (childLabel) {
                l.push(childLabel);
            }
        }
        return l;
    }, [childrenArray]);
    // Determine current index based on label
    const currentIndex = activeLabel ? labels.indexOf(activeLabel) : 0;

    const handleChange = (index: number) => {
        const label = labels[index];
        onChangeLabel?.(label);
    };

    return (
        <div className="text-foreground">
            {labels &&
                <div className="flex gap-0.5">
                    {labels.map((label, index) => (
                        <button
                            key={label}
                            className={`px-3 py-1 ${currentIndex === index ? "bg-surface-active"
                                : "bg-surface-1 hover:bg-surface-hover"
                                } ${index === 0
                                    ? 'rounded-l-lg'
                                    : index === labels.length - 1
                                        ? 'rounded-r-lg'
                                        : ''}`}
                            onClick={() => handleChange(index)}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            }
            <div className="mt-4">{childrenArray[currentIndex]}</div>
        </div>
    );
}
