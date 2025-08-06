import { CircleNotchIcon } from "@phosphor-icons/react";
import type { JSX } from "react";

function Loading(): JSX.Element {
    return (
        <div className="flex w-full justify-center text-white p-8" >
            <CircleNotchIcon className={"animate-spin text-white"} size={32} weight={"fill"} />
        </div>
    );
}
export default Loading;
