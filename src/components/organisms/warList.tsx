import type { JSX } from "react";

import { WarListCard, WarListCardSkeleton } from "../molecules/warlistcard";
import type { War } from "../../types/war";

interface WarListProps {
    wars: War[];
}
export function WarList({ wars }: WarListProps): JSX.Element {
    return (
        <>
            {wars.map(item => (
                <WarListCard key={item.id} war={item} />
            ))}
        </>
    );
}

interface SkeletonWarListProps {
    size: number;
}
export function SkeletonWarList({ size }: SkeletonWarListProps): JSX.Element {
    return (
        <>
            {Array.from({ length: size }).map((_, i) => (
                <WarListCardSkeleton key={i} />
            ))}
        </>
    );
}
