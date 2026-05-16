import type { JSX } from "react";
import { zToGrade } from "../../domain/stats/percentile";

type GradeLetter = "S+" | "S" | "A" | "B" | "C" | "D" | "E" | "F";

interface GradeProps {
    value: number;
    inverse: boolean;
}

const colorMap: Record<GradeLetter, string> = {
    "S+": "bg-purple-600",
    "S": "bg-pink-500",
    "A": "bg-green-500",
    "B": "bg-blue-500",
    "C": "bg-gray-500",
    "D": "bg-yellow-600",
    "E": "bg-orange-600",
    "F": "bg-red-600",
};

export default function Grade({ value, inverse }: GradeProps): JSX.Element {
    const letter = zToGrade(value, inverse) as GradeLetter;

    return (
        <span
            className={`
                w-10 h-10
                flex items-center justify-center
                rounded
                font-bold text-white
                ${colorMap[letter]}
            `}
        >
            {letter}
        </span>
    );
}
