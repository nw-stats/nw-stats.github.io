import type { Faction } from "../types/faction";


export function factionBgPrimary(faction: Faction): string {
    if (faction === "Marauder") {
        return 'bg-green-700';
    } else if (faction === "Covenant") {
        return 'bg-yellow-700';
    } else if (faction === 'Syndicate') {
        return 'bg-purple-700';
    }
    return 'bg-gray-700';
}
export function factionBgSecondary(faction: Faction): string {
    if (faction === "Marauder") {
        return 'bg-green-800';
    } else if (faction === "Covenant") {
        return 'bg-yellow-800';
    } else if (faction === 'Syndicate') {
        return 'bg-purple-800';
    }
    return 'bg-gray-800';
}

export function factionBgTertiary(faction: Faction): string {
    if (faction === "Marauder") {
        return 'bg-green-900';
    } else if (faction === "Covenant") {
        return 'bg-yellow-900';
    } else if (faction === 'Syndicate') {
        return 'bg-purple-900';
    }
    return 'bg-gray-900';
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
