import { useState, type JSX } from "react";
import { useWarsById } from "../hooks/useWarsById";
import NotFound from "./notfound";
import Loading from "../components/atom/loading";
//import RankingCard from "../components/atom/rankingcard";
import RankingsDisplay from "../components/organisms/rankingsdisplay";
import type { WinLoss } from "../types/ranking";

const kLeageNames: Record<string, string> = { M: "Main", G: "G" };

function Rankings(): JSX.Element {
    const { wars, error, loading } = useWarsById([]);
    const [league, setLeague] = useState<string>("M");

    if (error) return <NotFound />;
    if (loading) return <Loading />;

    // const companies = new Map<string, {atkWin: number, atkLoss: number, defWin: number, defLoss: number }>();
    const companies: Map<string, WinLoss> = new Map();

    for (const war of wars) {
        if (war.league !== league) continue;
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
            <div className="flex max-w-40">
                <button onClick={() => setLeague("M")} className={`text-white ${league === "M" ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-600 hover:bg-gray-700"} rounded-l-lg w-full pt-2 pb-2`}>Main</button>
                <button onClick={() => setLeague("G")} className={`text-white ${league === "G" ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-600 hover:bg-gray-700"} rounded-r-lg w-full pt-2 pb-2`} >G</button>
            </div>
            <div className="bg-gray-800 rounded-lg">
                <h1 className="text-white font-semibold text-xl p-2">{kLeageNames[league]} League</h1>
                <RankingsDisplay rankings={entries} />
            </div>
        </div >
    );
}


export default Rankings;
