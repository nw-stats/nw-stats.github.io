import { useMemo, type JSX } from "react";
import Dropdown from "../components/atom/dropdown";
import { usePlayerList } from "../hooks/usePlayerList";
import { useSearchParams } from "react-router-dom";
import Loading from "../components/atom/loading";
import NotFound from "./notfound";
import { usePlayerDetails } from "../hooks/usePlayerFull";
import { StatDistributionSet } from "../components/molecules/statdistributionset";
import { useMeanStdev } from "../hooks/useMeanStdev";
import SearchBox from "../components/atom/searchbox";
import { isRole } from "../types/role";
import { useSeason } from "../hooks/base/useSeason";
import { kSheetIds } from "../constants/sheets";

function PlayerCompare(): JSX.Element {
    const { season } = useSeason();
    console.log(season);
    const { loading, error, playerList } = usePlayerList(kSheetIds[season]);
    const [searchParams, setSearchParams] = useSearchParams();
    const { loading: zLoading, error: zError, zscore } = useMeanStdev(kSheetIds[season]);

    const player1 = searchParams.get("p1") ?? "";
    const player2 = searchParams.get("p2") ?? "";
    const role = searchParams.get("role") ?? "All";

    const setPlayer1 = (player1: string) => {
        setSearchParams(prev => {
            const next = new URLSearchParams(prev);
            next.set("p1", player1);
            return next;
        }, { replace: true });
    };

    const setPlayer2 = (player2: string) => {
        setSearchParams(prev => {
            const next = new URLSearchParams(prev);
            next.set("p2", player2);
            return next;
        }, { replace: true });
    };

    const setRole = (role: string) => {
        setSearchParams(prev => {
            const next = new URLSearchParams(prev);
            next.set("role", role);
            return next;
        }, { replace: true });
    };
    // const player1Options = useMemo(() => {
    //     return playerList.map(v => v.name);
    // }, [playerList]);
    // const player2Options = useMemo(() => {
    //     return playerList.map(v => v.name);
    // }, [playerList]);


    const {
        loading: player1Loading,
        error: player1Error,
        player: player1Details } = usePlayerDetails(kSheetIds[season], player1);
    const {
        loading: player2Loading,
        error: player2Error,
        player: player2Details } = usePlayerDetails(kSheetIds[season], player2);

    const player1AllDetails = player1Details.details.get("All");
    const player2AllDetails = player2Details.details.get("All");

    const options = useMemo(() => {
        const p1Roles = new Set<string>();
        const p2Roles = new Set<string>();

        if (player1AllDetails) {
            for (const entry of player1AllDetails.history) {
                p1Roles.add(entry.roleAssignment.role);
            }
        }
        if (player2AllDetails) {
            for (const entry of player2AllDetails.history) {
                p2Roles.add(entry.roleAssignment.role);
            }
        }

        const intersection = new Set([...p1Roles].filter(x => p2Roles.has(x)));

        return [...Array.from(intersection)];
    }, [player1AllDetails, player2AllDetails]);

    const playerNames = useMemo(() => {
        return playerList.map(v => v.name);
    }, [playerList])

    // const player1RoleDetails = useMemo(() => {
    //     console.log("change triggered");
    //     console.log(player1Details.details);
    //     return player1Details.details.get(role);
    // }, [player1Details.details, role]);
    // const player2RoleDetails = useMemo(() => {
    //     console.log("change triggered");
    //     console.log(player2Details.details);
    //     return player2Details.details.get(role);
    // }, [player2Details.details, role]);

    const series = useMemo(() => {
        return [
            {
                name: player1,
                value: player1AllDetails?.normalized ?? {
                    kills: 0,
                    deaths: 0,
                    assists: 0,
                    healing: 0,
                    damage: 0,
                },
                color: "red",
            },
            {
                name: player2,
                value: player2AllDetails?.normalized ?? {
                    kills: 0,
                    deaths: 0,
                    assists: 0,
                    healing: 0,
                    damage: 0,
                },
                color: "blue",
            }
        ]
    }, [player1, player1AllDetails, player2, player2AllDetails]);

    if (loading) return <Loading />
    if (error) return <NotFound />

    const canDisplay = player1AllDetails && player2AllDetails && isRole(role);
    const stillLoading = player1Loading || player2Loading || zLoading;
    const stillError = player1Error || player2Error || zError;
    const noCommonRoles = options.length === 0;

    return (
        <div className="mt-8 max-w-6xl mx-auto flex flex-col gap-6">

            <div
                className="
        rounded-2xl
        border border-border
        bg-gradient-to-b
        from-surface-1
        to-surface-2
        p-6
        shadow
    "
            >
                <h1 className="mb-5 text-xl font-bold text-title">
                    Compare Players
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                            <div
                                className="w-3 h-3 rounded-full"
                                style={{
                                    backgroundColor: "#ef4444"
                                }}
                            />

                            <label className="text-sm font-medium text-muted">
                                Player 1
                            </label>
                        </div>

                        <SearchBox
                            value={player1}
                            items={playerNames}
                            onSelect={setPlayer1}
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                            <div
                                className="w-3 h-3 rounded-full"
                                style={{
                                    backgroundColor: "#3b82f6"
                                }}
                            />

                            <label className="text-sm font-medium text-muted">
                                Player 2
                            </label>
                        </div>

                        <SearchBox
                            value={player2}
                            items={playerNames}
                            onSelect={setPlayer2}
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-muted">
                            Role
                        </label>

                        <Dropdown
                            options={options}
                            value={role}
                            onChange={setRole}
                        />
                    </div>

                </div>
            </div>

            {stillError
                ? <></>
                : stillLoading
                    ? <Loading />
                    : (canDisplay
                        && (<div
                            className="
                                rounded-2xl
                                border border-border
                                bg-surface-1
                                p-4
                            ">
                            {noCommonRoles
                                ? <div>Players do not have roles in common</div>
                                : <StatDistributionSet
                                    performanceProfile={zscore[role]}
                                    playerPerformance={series}
                                />
                            }
                        </div>
                        ))}
        </div>
    );

}
export default PlayerCompare;
