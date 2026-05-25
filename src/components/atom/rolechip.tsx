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

    "Shotcaller": "text-role-shotcaller",
    "Unassigned": "text-role-empty",
};

interface RoleChipProps {
    role: Role;
    inferred?: boolean;
}

export default function RoleChip({
    role,
    inferred = false,
}: RoleChipProps) {

    const safeRole: Role = role in KRoleCodes ? role : "Unassigned";

    return (
        <span
            className={`
                inline-flex items-center justify-center
                w-[5ch]
                px-2 py-0.5

                font-mono text-xs tracking-wider
                rounded-md

                border

                ${roleTextColors[safeRole]}

                border-current
                bg-current/10

                ${inferred ? "italic opacity-70" : ""}
            `}
        >
            {KRoleCodes[safeRole]}
        </span>
    );
}
