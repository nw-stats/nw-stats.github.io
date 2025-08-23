import type { ReactNode } from "react";

interface TabbedContentProps {
    children: ReactNode;
}

export function TabbedContent({ children }: TabbedContentProps) {
    console.log(children);
    return (
        children
    );
}
