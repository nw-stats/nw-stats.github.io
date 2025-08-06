import type { JSX } from "react";

const FORM = "https://docs.google.com/forms/d/e/1FAIpQLScyzRY-xd80nCzLR4gJWd_hIXkgrNZ8MAmP_ffkJeXH-luh8g/viewform?embedded=true";

function Feedback(): JSX.Element {
    return (
        <div className="p-4 flex flex-col max-w-7xl mx-auto bg-gray-200">
            <iframe
                src={FORM}
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
