import Loading from "../components/atom/loading";
import PlayerListCard from "../components/atom/playerlistcard";
import Construction from "../components/molecules/construction";
import { useCharacters } from "../hooks/useCharacters";
import { useState } from "react";

const Players: React.FC = () => {
    const { loading, error, players } = useCharacters();
    const [search, setSearch] = useState("");

    if (loading) return <Loading></Loading>
    if (error || !players) return <Construction></Construction>


    const filteredPlayers = players.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
    );
    return (
        <div className="flex flex-col max-w-3xl  pt-4 pb-4  mx-auto gap-6" >
            <input
                type="text"
                placeholder="Search players..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="p-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 w-full"
            />
            <div className="flex flex-col gap-2">
                {filteredPlayers.map(p => (
                    <div className="hover:scale-105" key={p.name}>
                        <PlayerListCard player={p} />
                    </div>
                ))}
            </div>
        </div >
    );
}

export default Players;
