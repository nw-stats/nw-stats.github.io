import { type JSX } from "react";
import NotFound from "./notfound";
import Loading from "../components/atom/loading";
import RankingsDisplay from "../components/organisms/rankingsdisplay";
import type { WinLoss } from "../types/ranking";
import { useWarRaw } from "../hooks/base/useWarsRaw";
import { kSheetIds } from "../constants/sheets";
import { useSeason } from "../hooks/base/useSeason";


function Rankings(): JSX.Element {
    const { season } = useSeason();
    const { wars, error, loading } = useWarRaw(kSheetIds[season]);

    if (error) return <NotFound />;
    if (loading) return <Loading />;

    // const companies = new Map<string, {atkWin: number, atkLoss: number, defWin: number, defLoss: number }>();
    const companies: Map<string, WinLoss> = new Map();

    for (const war of wars) {
        let attacker = companies.get(war.attacker);
        let defender = companies.get(war.defender);

        if (!attacker) {
            attacker = {
                name: war.attacker,
                faction: 'Gray',
                defenseWins: 0,
                defenseLoss: 0,
                attackWins: 0,
                attackLoss: 0,
            };
            companies.set(war.attacker, attacker);
        }
        if (!defender) {
            defender = {
                name: war.defender,
                faction: 'Gray',
                defenseWins: 0,
                defenseLoss: 0,
                attackWins: 0,
                attackLoss: 0,
            };
            companies.set(war.defender, defender);
        }

        attacker.attackWins += Number(war.attacker === war.winner);
        attacker.attackLoss += Number(war.attacker !== war.winner);
        defender.defenseWins += Number(war.defender === war.winner);
        defender.defenseLoss += Number(war.defender !== war.winner);
    }

    const entries = [...companies.entries()]
        .map(([_, company]) => company)
        .sort((a, b) => {
            const winsA = a.attackWins + a.defenseWins;
            const winsB = b.attackWins + b.defenseWins;

            if (winsA !== winsB) {
                return winsB - winsA; // More wins first
            }

            const lossesA = a.attackLoss + a.defenseLoss;
            const lossesB = b.attackLoss + b.defenseLoss;

            return lossesA - lossesB; // Fewer losses first
        });

    return (
        <div className="flex flex-col pt-8 max-w-6xl mx-auto gap-4">

            <div className="bg-background rounded-lg">
                <h1 className="text-foreground font-semibold text-xl p-2">Split Wars</h1>
                <RankingsDisplay rankings={entries} />
            </div>
        </div >
    );
}


export default Rankings;
