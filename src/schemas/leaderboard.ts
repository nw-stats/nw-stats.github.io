import * as v from "valibot";

export const LeaderboardSchema = v.object({
    id: v.number(),
    warId: v.number(),
    character: v.string(),
    score: v.number(),
    kills: v.number(),
    deaths: v.number(),
    assists: v.number(),
    healing: v.number(),
    damage: v.number(),
    company: v.string(),
    player: v.nullable(v.string()),
});

export type LeaderboardRow = v.InferOutput<typeof LeaderboardSchema>;
