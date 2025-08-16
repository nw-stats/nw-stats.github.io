import Loading from "../components/atom/loading";
import PlaceholderTile from "../components/molecules/placeholdertile";
import WarListCard from "../components/molecules/warlistcard";
import { useWarsById } from "../hooks/useWarsById";
import { currentHour } from "../utils/time";
// import Carousel from "../components/molecules/carousel";

const Home: React.FC = () => {
    const { loading, error, wars } = useWarsById([]);
    if (loading) return <div className="flex w-full justify-center text-white p-8" ><Loading /></div >;
    if (error) return <div className="flex w-full justify-center text-red-500">Error loading wars </div>;

    const rightNow = currentHour();
    const pastWars = wars.filter(item => item.date.toMillis() < rightNow.toMillis());
    const Upcoming = wars.filter(item => item.date.toMillis() >= rightNow.toMillis()).sort((a, b) => a.date.toMillis() - b.date.toMillis());

    return (
        <div className="flex flex-col w-full max-w-5xl mx-auto px-4 mt-4 relative">
            <div className="text-white text-xl font-semibold">
                Upcoming Wars
            </div>
            <div className="grid gap-4 grid-cols-1 w-full max-w-xl mx-auto mt-4">
                {loading ?
                    <div className="flex items-center justify-center text-white bg-gray-800 rounded-lg w-full h-full min-h-[104px]">
                        <Loading />
                    </div> :
                    Upcoming.length === 0 ?
                        <PlaceholderTile /> :
                        (Upcoming.map((v, i) => (
                            <WarListCard war={v} key={i} />
                        )))}

            </div>

            <div className="text-white text-xl font-semibold">Past Wars</div>
            <div className="grid gap-4 grid-cols-1 w-full max-w-xl mx-auto mt-4">
                {loading ?
                    <span className="text-white"><Loading /> </span> :
                    pastWars.map((v, i) => (
                        <WarListCard war={v} key={i} />
                    ))
                }
            </div>

        </div >
    );
};
export default Home;
