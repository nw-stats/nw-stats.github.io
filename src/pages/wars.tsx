import { Checkbox } from "../components/atom/checkbox";
import type { JSX } from "react";
import { useHydratedWars } from "../hooks/wars/useHydratedWars";
import NotFound from "./notfound";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { SkeletonWarList, WarList } from "../components/organisms/warList";

export function Wars(): JSX.Element {
    const [showOnlyCompleted, setShowOnlyCompleted] = useLocalStorage('showOnlyCompleted', false);
    const { data: wars, isLoading, isError } = useHydratedWars();
    if (!wars || isError) return <NotFound />;

    return (
        <div className="flex flex-col w-full max-w-5xl mx-auto px-4 mt-4">
            <main className="flex flex-col md:flex-row md:items-start gap-6">
                {/* War cards */}
                <div className="flex-1 md:order-1 order-2">
                    <div className="text-white text-xl font-semibold">Wars</div>
                    <div className="grid gap-4 grid-cols-1 w-full mt-4">
                        {
                            isLoading ?
                                <SkeletonWarList size={6} />
                                : <WarList wars={wars} />
                        }
                    </div>
                </div>

                {/* Sidebar filters */}
                <div className="flex flex-col gap-2 w-full md:w-48 md:order-2 order-1 text-white">
                    <div className="text-white text-xl font-semibold">Filters</div>

                    <Checkbox
                        label="Only show past wars with stats"
                        checked={showOnlyCompleted}
                        onChecked={setShowOnlyCompleted}
                    />
                </div>
            </main>
        </div>
    );
}
