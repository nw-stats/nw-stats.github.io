import type { DateTime } from "luxon";
import type { CaptureTimes } from "../captures";
import type { Status } from "../status";

export interface WarRaw {
    id: number;
    date: DateTime;
    server: string;
    map: string;
    attacker: string;
    defender: string;
    winner: string;
    duration: number;
    captures: CaptureTimes;
    status: Status;
    hideRoles: boolean;
}
