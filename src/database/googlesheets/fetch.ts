import { parseGviz } from "./parsegviz";
import type { GvizRow, GvizType } from "./types";

const SHEETS_BASE_URL: string = "https://docs.google.com/spreadsheets/d/{sheetId}/gviz/tq?tqx=out:json&sheet={sheetName}&tq={query}";
const TEMPLATE_SHEET_ID: string = "{sheetId}";
const TEMPLATE_SHEET_NAME: string = "{sheetName}";
const TEMPLATE_QUERY: string = "{query}"


export async function fetchSheet(
    sheetId: string,
    sheetName: string,
    query: string
): Promise<GvizType[][]> {
    const encodedQuery = encodeURIComponent(query)
    const fullUrl = SHEETS_BASE_URL
        .replace(TEMPLATE_SHEET_ID, sheetId)
        .replace(TEMPLATE_SHEET_NAME, sheetName)
        .replace(TEMPLATE_QUERY, encodedQuery);
    const response = await fetch(fullUrl);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const text = await response.text();
    const json = parseGviz(text);
    const rows =
        json.table.rows.map(
            (row: GvizRow) =>
                row.c.map(
                    cell => cell?.v ?? null
                )
        );
    return rows;
}
