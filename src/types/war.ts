import type { DateTime } from "luxon";
import type { Company } from "./company";
import type { CaptureTimes } from "./captures";
import type { Status } from "./status";

export interface War {
    id: number;
    date: DateTime;
    server: string;
    territory: string;
    attacker: Company;
    defender: Company;
    winner?: string;
    captureTimes: CaptureTimes;
    duration?: number;
    show: boolean;
    status: Status;
    hideRoles: boolean;
}
