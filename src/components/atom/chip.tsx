import type { JSX, ReactNode } from "react";

type ChipProps = {
    children: ReactNode;
};

export default function Chip({ children }: ChipProps): JSX.Element {
    return (
        <div
            className="
                inline-flex items-center
                rounded-full
                border border-border
                bg-gradient-to-b from-surface-1 to-surface-2
                px-3 py-1
                font-medium text-foreground
                shadow-sm
                transition
                hover:shadow
            "
        >
            {children}
        </div>
    );
}
