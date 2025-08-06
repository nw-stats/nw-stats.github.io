

const kBaseUrl: string = `https://docs.google.com/spreadsheets/d/{sheetId}/gviz/tq?tqx=out:json&sheet={sheetName}&tq={query}`;
const kSheetId = "{sheetId}"
const kSheetName = "{sheetName}"
const kQuery = "{query}"



export type DataType = string | number | boolean | Date | null;

export async function fetchTableFromGoogleSheets(
    sheetId: string,
    sheetName: string,
    query: string
): Promise<DataType[][]> {
    try {
        const encodedQuery = encodeURI(query);
        const fullurl = kBaseUrl
            .replace(kSheetId, sheetId)
            .replace(kSheetName, sheetName)
            .replace(kQuery, encodedQuery);
        const response = await fetch(fullurl);
        const text = await response.text();
        const json = JSON.parse(text.substring(47).slice(0, -2));
        const rows: DataType[][] = json.table.rows.map((row: any) =>
            row.c.map((cell: any) => cell?.v ?? null)
        );
        return rows;
    } catch (err) {
        return [];
    }
}
