
//export const kSheetId = "1Zpmwiu2M3AHdPVwaZ8A-nIPN5eKGclLSfnLl_Xn10PA";

// export const kSheetId = "1ELcKgvKnpSNeboUlpyaXyu0B9KvQaJvyWkeLvgAGijw";
export interface SheetId {
    id: string;
}
export const DEFAULT_SEASON = "Season58";
export const kSheetIds = {
    Season58: { id: "1ELcKgvKnpSNeboUlpyaXyu0B9KvQaJvyWkeLvgAGijw" },
    Season57: { id: "15pldhdsgAuec9NimMaMklKJKGspQqHJxdiUXOTIOrjQ" },
    Season56: { id: "1AsA8Fwes78ro-5Mk1eworr6l7indKX7GcE5krOfR3UM" },
    Season10: { id: "1o2To8AjGkrFZUP2vb7BH5hYJufvj52hiD18lKc3ki6Y" },
    Season9: { id: "1SitKIkswCaornJ7tIYueADQC3eq78TRI_RnXGPJee7s" },
    All: { id: "1Xvq4_qH2p0xZejCSHJfuVqXo5sOlpP4JkwC9_eWGxFE" }
};

export type Season = keyof typeof kSheetIds;
