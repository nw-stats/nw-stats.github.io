import * as v from 'valibot'
import type { DataType } from '../../types/datatype';

const kBaseUrl: string = `https://docs.google.com/spreadsheets/d/{sheetId}/gviz/tq?tqx=out:json&sheet={sheetName}&tq={query}`;
const kSheetId = "{sheetId}"
const kSheetName = "{sheetName}"
const kQuery = "{query}"

export async function fetchTableFromGoogleSheets(
    sheetId: string,
    sheetName: string,
    query: string
): Promise<DataType[][]> {
    let text = '';
    try {
        const encodedQuery = encodeURIComponent(query);
        const fullurl = kBaseUrl
            .replace(kSheetId, sheetId)
            .replace(kSheetName, sheetName)
            .replace(kQuery, encodedQuery);
        const response = await fetch(fullurl);
        text = await response.text();
        const json = JSON.parse(text.substring(47).slice(0, -2));
        const rows: DataType[][] = json.table.rows.map((row: any) =>
            row.c.map((cell: any) => cell?.v ?? null)
        );
        return rows;
    } catch (err) {
        console.error(query);
        console.error(text);
        console.error("there was an error", err)
        return [];
    }
}

export async function fetchValidated<TEntries extends Record<string, any>>(
    sheetId: string,
    sheetName: string,
    query: string,
    schema: v.ObjectSchema<TEntries, any>
): Promise<v.InferOutput<typeof schema>[]> {
    const rows = await fetchTableFromGoogleSheets(sheetId, sheetName, query);

    // 🔑 Extract keys from schema
    const keys = Object.keys(schema.entries) as (keyof TEntries)[];

    const objects = rows.map((row) => {
        const obj: Record<string, unknown> = {};
        keys.forEach((key, i) => {
            obj[key as string] = row[i];
        });
        return obj;
    });

    const validated: v.InferOutput<typeof schema>[] = [];
    for (const obj of objects) {
        try {
            validated.push(v.parse(schema, obj));
        } catch (err) {
            console.error("Validation error:", err, "for row:", obj);
        }
    }

    return validated;
}
