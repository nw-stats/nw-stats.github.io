import * as v from 'valibot';

export const PlayerSchema = v.object({
    id: v.number(),
    name: v.string(),
    discord: v.nullable(v.string()),
    twitch: v.nullable(v.string()),
    picture: v.nullable(v.string()),
});

export type PlayerRow = v.InferOutput<typeof PlayerSchema>;
