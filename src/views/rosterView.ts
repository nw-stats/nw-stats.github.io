import type { Army, Group, GroupKey, RosterSplit } from "../types/roster";
import { getOrCreate } from "../utils/map";

export type RosterView = Map<GroupKey, Group>;

export function buildRosterView(army: Army, split: RosterSplit) {
    const view = new Map<GroupKey, Group>;

    for (const character of army) {
        const key = character.group;
        const qdps = character.qdps;

        const group = getOrCreate(view, key, () => []);

        if (split === 'jonied') {
            group.push(character);
        } else if (split === 'split') {
            if (qdps) {
                const qdpsGroup = getOrCreate(view, key, () => []);
                qdpsGroup.push(character);
            }
        } else if (split === 'both') {
            group.push(character);
            if (qdps) {
                const qdpsGroup = getOrCreate(view, key, () => []);
                qdpsGroup.push(character);
            }
        }
    }
}
