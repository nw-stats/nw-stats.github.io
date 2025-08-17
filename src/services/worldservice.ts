import { kWorldColumns, kWorldSheetId, kWorldSheetName, kWorldTable } from "../mapping/worldmap";
import { type World } from "../types/world";
import { constructQuery } from "../utils/querybuilder";
import { convertInt, convertRegion, convertString, convertWorldKind, convertWorldSet } from "../utils/sheetconvert";
import { fetchTableFromGoogleSheets } from "./googlesheets";

export async function getWorlds(): Promise<World[]> {
    const query = constructQuery([
        kWorldColumns.id,
        kWorldColumns.name,
        kWorldColumns.region,
        kWorldColumns.worldset,
        kWorldColumns.kind,
    ]);

    const data = await fetchTableFromGoogleSheets(kWorldSheetId, kWorldSheetName, query);
    const worlds: World[] = [];
    for (const row of data) {
        const id = convertInt(row[kWorldTable.id]);
        const name = convertString(row[kWorldTable.name]);
        const region = convertRegion(row[kWorldTable.region]);
        const worldset = convertWorldSet(row[kWorldTable.worldset]);
        const kind = convertWorldKind(row[kWorldTable.kind]);
        worlds.push({ id, name, region, worldset, kind });
    }
    return worlds;
}
