import Loading from "../components/atom/loading";
import WarListCard from "../components/molecules/warlistcard";
import { useWarsById } from "../hooks/useWarsById";

const Wars: React.FC = () => {
    const { loading, error, wars } = useWarsById([]);
    if (loading) return <div className="flex w-full justify-center text-white p-8" ><Loading /></div >;
    if (error) return <div className="text-white">Problem loading wars</div>


    const warCards = []
    for (let i = wars.length - 1; i >= 0; i--) {
        warCards.push(
            <div key={wars[i].id} className="text-white hover:scale-105">
                <WarListCard war={wars[i]} />
            </div>
        );
    }
    return (

        <div className="flex flex-col w-full mx-auto max-w-3xl gap-4">
            <h1 className="text-2xl font-semibold text-white items-end">Season 3 Wars</h1>
            <div className="grid grid-cols-1 gap-2 text-white m">
                {warCards}
            </div >
        </div >
    )
};

export default Wars;
