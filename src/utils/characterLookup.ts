import type { RosterCharacter, Rosters } from "../types/roster";
import type { WarId } from "../types/warId";
export function createCharacterLookupKey(
    warId: number,
    companyName: string,
    characterName: string
): string {
    return `${warId}|${companyName}|${characterName}`;
}
export function createCharacterLookupMap(
    rosters: Map<WarId, Rosters>
): Map<string, RosterCharacter> {
    const characterLookup = new Map<string, RosterCharacter>();
    for (const [warId, roster] of rosters) {
        for (const [companyName, army] of roster) {
            for (const character of army) {
                const k = createCharacterLookupKey(warId, companyName, character.character);
                characterLookup.set(k, character);
            }
        }
    }
    return characterLookup;
}
