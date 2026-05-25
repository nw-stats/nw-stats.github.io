import type { JSX, ReactNode } from "react";
import { MegaphoneIcon, SparkleIcon } from "@phosphor-icons/react";

type BannerProps = {
    title: string;
    tag?: string;
    children: ReactNode;
};

export default function Banner({
    title,
    tag = "NEW",
    children
}: BannerProps): JSX.Element {
    return (
        <div
            className="
                group relative overflow-hidden
                rounded-3xl
                border border-border

                bg-gradient-to-br
                from-surface-1
                via-surface-2
                to-surface-1

                shadow-lg
                transition-all
                hover:scale-[1.01]
                hover:shadow-xl
            "
        >
            {/* faction accent */}
            <div
                className="
                    absolute top-0 left-0 right-0
                    h-1.5
                    bg-gradient-to-r
                    from-marauder-secondary
                    via-covenant-secondary
                    to-syndicate-secondary
                "
            />

            {/* giant background icon
            <MegaphoneIcon
                weight="fill"
                size={220}
                className="
                    absolute
                    -right-10
                    -top-10
                    text-surface-3/30
                    rotate-[-20deg]
                "
            /> */}

            {/* glow orb */}
            <div
                className="
                    absolute
                    left-[-30px]
                    top-[-20px]

                    h-32
                    w-32

                    rounded-full
                    bg-covenant-secondary/20
                    blur-3xl

                    animate-pulse
                "
            />

            <div className="relative p-6 flex gap-5">

                <div
                    className="
                        flex
                        h-16
                        w-16
                        shrink-0

                        items-center
                        justify-center

                        rounded-2xl

                        border border-border

                        bg-surface-3
                        shadow-md
                    "
                >
                    <MegaphoneIcon
                        size={32}
                        weight="duotone"
                        className="text-title"
                    />
                </div>

                <div className="flex-1">

                    <div className="flex items-center gap-3">

                        <div
                            className="
                                rounded-full
                                px-3 py-1

                                text-xs
                                font-bold

                                bg-covenant-secondary
                                text-background
                            "
                        >
                            {tag}
                        </div>

                        <h2
                            className="
                                text-xl
                                font-black
                                text-title
                            "
                        >
                            {title}
                        </h2>

                        <SparkleIcon
                            size={18}
                            weight="fill"
                            className="
                                text-covenant-secondary
                                animate-pulse
                            "
                        />

                    </div>

                    <div
                        className="
                            mt-3
                            leading-relaxed
                        "
                    >
                        {children}
                    </div>

                </div>
            </div>
        </div>
    );
}
