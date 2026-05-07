import type { Role } from "../../types/role";
const roleTextColors: Record<Role, string> = {
    // Healers
    "Healer MB": "text-emerald-400",
    "Healer AOE": "text-green-400",
    "Healer KS": "text-lime-400",

    // Frontline
    "Bruiser": "text-orange-400",
    "Tank": "text-slate-300",
    "Flail": "text-amber-300",

    // DPS
    "QDPS": "text-red-400",
    "VG IG": "text-violet-400",
    "Disruptor": "text-pink-400",
    "Firestaff": "text-rose-400",
    "Ranged": "text-sky-400",
    "Blunderbuss": "text-yellow-300",

    // Utility
    "Shotcaller": "text-cyan-400",

    "Many": "text-gray-300",

    "": "text-gray-500",
};

interface RoleTextProps {
    role: Role;
    inferred?: boolean;
}

export default function RoleText({
    role,
    inferred = false,
}: RoleTextProps) {
    return (
        <span
            className={`
                ${roleTextColors[role]}
                ${inferred ? "italic opacity-70" : ""}
            `}
        >
            {role || "Unknown"}
        </span>
    );
}
