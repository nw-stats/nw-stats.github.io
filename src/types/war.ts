import type { DateTime } from "luxon";
import type { CaptureTimes } from "./captures";
import type { Company } from "./company";

export interface War {
    id: number;
    date: DateTime;
    server: string;
    map: string;
    attacker: Company;
    defender: Company;
    winner: string;
    duration: number;
    captures: CaptureTimes;
    hideRoles: boolean;
}
