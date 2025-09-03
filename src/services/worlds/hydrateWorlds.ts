import type { WorldRow } from "../../schemas/world";
import { validRegion, validWorldKind, validWorldSet, type World, } from "../../types/world";
import { toLiteral } from "../../utils/convert";

export function hydrateWorlds(rows: WorldRow[]): World[] {
    return rows.map(row => ({
        name: row.name,
        region: toLiteral(validRegion, row.region, 'unknown'),
        worldset: toLiteral(validWorldSet, row.worldSet, 'unknown'),
        kind: toLiteral(validWorldKind, row.kind, 'unknown'),
    }));
}
