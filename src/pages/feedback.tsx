import type { JSX } from "react";
import { kFeedbackForm } from "../constants/feedback";


function Feedback(): JSX.Element {
    return (
        <div className="p-4 flex flex-col max-w-7xl mx-auto bg-gray-200">
            <iframe
                src={kFeedbackForm}
                width="100%"
                height="800"
                title="Feedback Form"
            >
                Loading…
            </iframe>
        </div>
    )
}

export default Feedback;
