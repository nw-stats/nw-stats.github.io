import type { JSX } from "react";

interface SkeletonProps {
    className?: string
}
export function Skeleton({ className }: SkeletonProps): JSX.Element {
    return (
        <span className={`${className} rounded-lg bg-gray-600 animate-pulse`}></span>
    );
}
