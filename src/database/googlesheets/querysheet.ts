import type { Sheet } from './sheet';
import { fetchSheet } from './fetch';
import type { PredicateNode } from './predicate';
import { buildQuery } from './querybuilder';
import type { Ordering } from './types';
import * as v from 'valibot'

export async function queryGoogleSheets<T, D>(
    sheet: Sheet<T, D>,
    schema: v.GenericSchema,
    mapper: (x: T) => D,
    where?: PredicateNode<T>,
    orderBy?: Ordering<T>,
    limit?: number,
): Promise<D[]> {

    const query = buildQuery(sheet, where, orderBy, limit);

    const rows = await fetchSheet(
        sheet.sheetId,
        sheet.sheetName,
        query
    );

    return rows
        .map(row => v.parse(schema, row) as T)
        .map(mapper);
}
