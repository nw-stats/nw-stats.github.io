
//export const kSheetId = "1Zpmwiu2M3AHdPVwaZ8A-nIPN5eKGclLSfnLl_Xn10PA";

// export const kSheetId = "1ELcKgvKnpSNeboUlpyaXyu0B9KvQaJvyWkeLvgAGijw";
export interface SheetId {
    id: string;
}
export const DEFAULT_SEASON = "Season56";
export const kSheetIds = {
    Season56: { id: "1ELcKgvKnpSNeboUlpyaXyu0B9KvQaJvyWkeLvgAGijw" },
    Season10: { id: "1o2To8AjGkrFZUP2vb7BH5hYJufvj52hiD18lKc3ki6Y" },
    Season9: { id: "1SitKIkswCaornJ7tIYueADQC3eq78TRI_RnXGPJee7s" }
};

export type Season = keyof typeof kSheetIds;
