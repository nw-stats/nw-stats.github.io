import * as v from 'valibot';

export type ColumnLabel = `Col${number}`
export interface Sheet<T, D> {
    sheetName: string;
    sheetId: string;
    columns: Record<keyof T, ColumnLabel>;
    schema: v.GenericSchema<unknown, T>;
    mapper: (dto: T) => D;
}
