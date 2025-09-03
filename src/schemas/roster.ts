import * as v from 'valibot';

export const RosterSchema = v.object({
    id: v.number(),
    warId: v.number(),
    company: v.string(),
    character: v.string(),
    role: v.nullable(v.string()),
    group: v.number(),
    qdps: v.nullable(v.string()),
    player: v.nullable(v.string()),
});

export type RosterRow = v.InferOutput<typeof RosterSchema>;
