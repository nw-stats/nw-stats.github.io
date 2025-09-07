import * as v from 'valibot';

export const CharacterSchema = v.object({
    id: v.number(),
    name: v.string(),
    player: v.nullable(v.string()),
    server: v.string(),
    faction: v.nullable(v.string()),
    company: v.nullable(v.string()),
    picture: v.nullable(v.string()),
});

export type CharacterRow = v.InferOutput<typeof CharacterSchema>;
