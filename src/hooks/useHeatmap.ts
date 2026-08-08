import { useMemo } from "react";
import type { War } from "../types/hydratedtypes/war";
import type { GroupKey } from "../types/roster";
import { getPressure } from "../utils/groups";
import { getHeatmapColor } from "../utils/heatmap";
import { factionColorVar } from "../utils/factions";
import type { GroupPerformance } from "../types/leaderboard";

export interface HeatmapRegion {
    attacker: number;
    defender: number;
    color: string;
}

export interface HeatmapData {
    point: HeatmapRegion;
    topLeft: HeatmapRegion;
    topRight: HeatmapRegion;
    bottomLeft: HeatmapRegion;
    bottomRight: HeatmapRegion;
    weak: HeatmapRegion;
    strong: HeatmapRegion;
    outer: HeatmapRegion;
    wide: HeatmapRegion;
}

const NEUTRAL_COLOR = "#eeeeee";

const NEUTRAL: HeatmapData = {
    point: { attacker: 0, defender: 0, color: NEUTRAL_COLOR },
    topLeft: { attacker: 0, defender: 0, color: NEUTRAL_COLOR },
    topRight: { attacker: 0, defender: 0, color: NEUTRAL_COLOR },
    bottomLeft: { attacker: 0, defender: 0, color: NEUTRAL_COLOR },
    bottomRight: { attacker: 0, defender: 0, color: NEUTRAL_COLOR },
    weak: { attacker: 0, defender: 0, color: NEUTRAL_COLOR },
    strong: { attacker: 0, defender: 0, color: NEUTRAL_COLOR },
    outer: { attacker: 0, defender: 0, color: NEUTRAL_COLOR },
    wide: { attacker: 0, defender: 0, color: NEUTRAL_COLOR },
};

function buildRegion(
    atk: number,
    def: number,
    maxPressure: number,
    attackerColor: string,
    neutralColor: string,
    defenderColor: string,
): HeatmapRegion {
    return {
        attacker: atk,
        defender: def,
        color: getHeatmapColor(atk - def, maxPressure, defenderColor, neutralColor, attackerColor),
    };
}

export function useHeatmap(
    war: War | undefined,
    groupDetails: Map<string, Map<GroupKey, GroupPerformance>>,
): HeatmapData {
    return useMemo(() => {
        if (!war) return NEUTRAL;

        const atkGrps = groupDetails.get(war.attacker.name);
        const defGrps = groupDetails.get(war.defender.name);
        if (!atkGrps || !defGrps) return NEUTRAL;

        const pressure = getPressure(atkGrps, defGrps);
        const atk = (key: number) => pressure.attackPressure.get(key as GroupKey) ?? 0;
        const def = (key: number) => pressure.defendPressure.get(key as GroupKey) ?? 0;
        const max = pressure.maxPressure;

        const attackerColor = factionColorVar(war.attacker.faction);
        const defenderColor = factionColorVar(war.defender.faction);
        const neutralColor = factionColorVar('Gray');

        const region = (key: number) =>
            buildRegion(atk(key), def(key), max, attackerColor, neutralColor, defenderColor);

        return {
            point: buildRegion(atk(1) / 2 + atk(2) / 2, def(1) / 2 + def(2) / 2, max, attackerColor, neutralColor, defenderColor),
            topLeft: region(6),
            topRight: region(5),
            bottomLeft: region(4),
            bottomRight: region(3),
            weak: region(7),
            strong: region(8),
            outer: region(9),
            wide: region(10),
        };
    }, [war, groupDetails]);
}
