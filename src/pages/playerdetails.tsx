import { useParams } from "react-router-dom";
import Loading from "../components/atom/loading";
import NotFound from "./notfound";
import { usePlayerDetails } from "../hooks/usePlayerDetails";


export function PlayerDetails() {
    // const { name } = useParams<{ name: string }>();
    // const { data: details, isLoading, isError } = usePlayerDetails({ name });
    // if (isLoading) return <Loading />;
    // if (isError) return <NotFound />;

    // const player = details.pl

    // const options = useMemo(() => {
    //     if (details.pl)
    //     return details.player?.characters
    // }, [details])

    return (
        <>

        </>
    );
}
