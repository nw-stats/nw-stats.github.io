import { useLocation } from "react-router-dom";
import type { JSX } from "react/jsx-dev-runtime";
import { kInnaccuracyForm as kInaccuracyForm } from "../constants/feedback";

const kUrlFieldId = "entry.933154191";

function Inaccuracy(): JSX.Element {
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const fromParam = query.get("from");
    const fromPath = fromParam ? `https://nw-stats.github.io${fromParam}` : "";

    const preFilledForm = `${kInaccuracyForm}&${kUrlFieldId}=${encodeURIComponent(fromPath)}`;

    return (
        <div className="p-4 flex flex-col max-w-7xl mx-auto bg-gray-200">
            <iframe
                src={preFilledForm}
                width="100%"
                height="800"
                title="Feedback Form"
            >
                Loading…
            </iframe>
        </div>
    );
}


export default Inaccuracy;
