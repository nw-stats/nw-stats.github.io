import type { Role } from "../../types/role";
const roleTextColors: Record<Role, string> = {
    "Healer MB": "text-role-healer-mb",
    "Healer AOE": "text-role-healer-aoe",
    "Healer KS": "text-role-healer-ks",

    "Bruiser": "text-role-bruiser",
    "Tank": "text-role-tank",
    "Flail": "text-role-flail",

    "QDPS": "text-role-qdps",
    "VG IG": "text-role-vg-ig",
    "Disruptor": "text-role-disruptor",
    "Firestaff": "text-role-firestaff",
    "Ranged": "text-role-ranged",
    "Blunderbuss": "text-role-blunderbuss",

    "Shotcaller": "text-role-shotcaller",

    "Unassigned": "text-role-empty",
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
