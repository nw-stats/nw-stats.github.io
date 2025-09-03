import * as v from 'valibot';

export const CompanySchema = v.object({
    id: v.number(),
    name: v.string(),
    server: v.string(),
    faction: v.string(),
    governor: v.nullable(v.string()),
});

export type CompanyRow = v.InferOutput<typeof CompanySchema>;
