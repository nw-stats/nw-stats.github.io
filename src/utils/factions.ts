import type { Faction } from "../types/faction";


export function factionBgPrimary(faction: Faction): string {
    if (faction === "Marauder") {
        return 'bg-marauder-primary';
    } else if (faction === "Covenant") {
        return 'bg-covenant-primary';
    } else if (faction === 'Syndicate') {
        return 'bg-syndicate-primary';
    }
    return 'bg-gray-primary';
}
export function factionBgSecondary(faction: Faction): string {
    if (faction === "Marauder") {
        return 'bg-marauder-secondary';
    } else if (faction === "Covenant") {
        return 'bg-covenant-secondary';
    } else if (faction === 'Syndicate') {
        return 'bg-syndicate-secondary';
    }
    return 'bg-gray-secondary';
}

export function factionBgTertiary(faction: Faction): string {
    if (faction === "Marauder") {
        return 'bg-marauder-tertiary';
    } else if (faction === "Covenant") {
        return 'bg-covenant-tertiary';
    } else if (faction === 'Syndicate') {
        return 'bg-syndicate-tertiary';
    }
    return 'bg-gray-tertiary';
}

export function factionBgDark(faction: Faction): string {
    if (faction === "Marauder") {
        return 'bg-green-950';
    } else if (faction === "Covenant") {
        return 'bg-yellow-950';
    } else if (faction === "Syndicate") {
        return 'bg-purple-950';
    }
    return 'bg-gray-950';
}

export function factionBgLight(faction: Faction): string {
    if (faction === "Marauder") {
        return 'bg-green-300';
    } else if (faction === "Covenant") {
        return 'bg-yellow200';
    } else if (faction === "Syndicate") {
        return 'bg-purple-300';
    }
    return 'bg-gray-300';
}

export function factionBorder(faction: Faction): string {
    if (faction === "Marauder") {
        return 'border-green-900';
    } else if (faction === "Covenant") {
        return 'border-yellow-900';
    } else if (faction === 'Syndicate') {
        return 'border-purple-900';
    }
    return 'border-gray-900';
}

export function factionText(faction: Faction): string {
    if (faction === "Marauder") {
        return 'text-green-700';
    } else if (faction === "Covenant") {
        return 'text-yellow-700';
    } else if (faction === 'Syndicate') {
        return 'text-purple-700';
    }
    return 'text-gray-700';
}

export function factionAccentBar(faction: Faction): string {
    if (faction === "Marauder") {
        return "before:bg-green-500";
    } else if (faction === "Syndicate") {
        return "before:bg-purple-500";
    } else if (faction === "Covenant") {
        return "before:bg-yellow-400";
    } else {
        return "before:bg-gray-500";
    }
}

export function factionColorVar(faction: Faction): string {
    switch (faction) {
        case "Marauder":
            return "var(--marauder-primary)";

        case "Syndicate":
            return "var(--syndicate-primary)";

        case "Covenant":
            return "var(--covenant-primary)";

        default:
            return "var(--gray-primary)";
    }
}

export function factionColorVarMin(faction: Faction): string {
    switch (faction) {
        case "Marauder":
            return "#b9f8cf";

        case "Syndicate":
            return "#e9d4ff";

        case "Covenant":
            return "#fff085";

        default:
            return "#e5e7eb";
    }
}

export function factionColorVarMax(faction: Faction): string {
    switch (faction) {
        case "Marauder":
            return "#008236";

        case "Syndicate":
            return "#8200db";

        case "Covenant":
            return "#a65f00";

        default:
            return "#364153";
    }
}
