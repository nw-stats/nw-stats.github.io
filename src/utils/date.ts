import { DateTime } from "luxon";

export function convertGoogleSheetsDateToDateTime(gsDate: string): DateTime {
    const match = gsDate.match(/Date\((\d+),(\d+),(\d+)(?:,(\d+),(\d+),(\d+))?\)/);
    if (!match) return DateTime.now();

    const year = Number(match[1]);
    const month = Number(match[2]) + 1; // convert 0-indexed → 1-indexed
    const day = Number(match[3]);
    const hour = Number(match[4] ?? 0);
    const minute = Number(match[5] ?? 0);
    const second = Number(match[6] ?? 0);

    const dt = DateTime.local(year, month, day, hour, minute, second);

    return dt;
}

export function combineDateAndTime(date: DateTime, time: DateTime, tz: string): DateTime {
    const combined = date.set({
        hour: time.hour,
        minute: time.minute,
        second: time.second,
        millisecond: time.millisecond
    }).setZone(tz, { keepLocalTime: true });

    return combined
}
