import { KRoleCodes, type Role } from "../../types/role";
const roleTextColors: Record<Role, string> = {
    "Healer MB": "text-role-healer-mb",
    "Healer AOE": "text-role-healer-aoe",
    "Healer KS": "text-role-healer-ks",

    "Bruiser": "text-role-bruiser",
    "Tank": "text-role-tank",
    "Flail": "text-role-flail",

    "DPS": "text-role-dps",
    "QDPS": "text-role-qdps",
    "VG IG": "text-role-vg-ig",
    "KS VG": "text-role-ks-vg",

    "Disruptor": "text-role-disruptor",
    "Point Spear": "text-role-empty",
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

    const safeRole = role in KRoleCodes ? role : "Unassigned";
    return (



        <span
            className={`
        font-mono
        tracking-wider
        text-xs
        px-1.5 py-0.5
        rounded
        ${roleTextColors[safeRole]}
        ${inferred ? "italic opacity-70" : ""}
    `}
        >
            {KRoleCodes[safeRole]}
        </span>
    );
}
