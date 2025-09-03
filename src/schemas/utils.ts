import * as v from 'valibot';

export function schemaToColumns<TSchema extends v.ObjectSchema<any, any>>(schema: TSchema) {
    const keys = Object.keys(schema.entries);
    const letters = keys.map((_, i) => String.fromCharCode("A".charCodeAt(0) + i));
    return Object.fromEntries(keys.map((k, i) => [k, letters[i]]));
}
