import * as v from 'valibot';
import type { QueryParameter, Ordering } from './googlesheets/queryparameter';
import { constructQuery } from './googlesheets/querybuilder';
import { fetchTableFromGoogleSheets } from './googlesheets/googlesheets';

export async function getService<T extends v.ObjectSchema<any, any>>(
    sheetId: string,
    sheetName: string,
    schema: T,
    params?: QueryParameter<T>[],
    limit?: number,
    order?: Ordering<T>,
): Promise<v.InferOutput<T>[]> {
    const query = constructQuery(schema, params, order, limit);
    const rows = await fetchTableFromGoogleSheets(sheetId, sheetName, query);

    const keys = Object.keys(schema.entries) as Array<keyof T['entries']>;
    const objects: Record<string, unknown>[] = rows.map(row => {
        const obj: Record<string, unknown> = {};
        keys.forEach((key, i) => {
            obj[key as string] = row[i];
        });
        return obj;
    });

    // Validate each row
    const validated: v.InferOutput<T>[] = [];
    for (const obj of objects) {
        try {
            validated.push(v.parse(schema, obj));
        } catch (err) {
            console.error("Validation error:", err, "for row:", obj);
        }
    }

    return validated;
}
