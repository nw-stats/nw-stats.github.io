import { DateTime } from 'luxon';

export function formatSeconds(seconds: number, pad: string = '0'): string {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, pad)}`;
}

export function formatDate(date: DateTime): string {
    return date.toFormat("M/dd/yyyy");
}

export function formatTime(date: DateTime): string {
    const localDt = date.setZone("local");
    return localDt.toLocaleString(DateTime.TIME_SIMPLE) + ' ' +
        localDt.toLocaleString({ timeZoneName: 'short' }).split(' ').pop();
}

export function formatDatetime(date: DateTime): string {
    return `${formatDate(date)} ${formatTime(date)}`;
}

export function convertFromGoogleSheetsDateString(dateString: string): DateTime {
    const match = dateString.match(/Date\((\d+),(\d+),(\d+)(?:,(\d+),(\d+),(\d+))?\)/);
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
    console.log(combined.toFormat("MM/dd/yyyy h:mm a z"), tz); // e.g., 08/15/2025 1:34 PM EDT

    return combined
}

export function currentHour(): DateTime {
    const rightNow = DateTime.now();
    rightNow.set({ minute: 0, second: 0, millisecond: 0 });
    return rightNow;
}

export function formatPercent(value: number, figures?: number): string {
    let sigFig = figures ? figures : 2;
    return `${(value * 100).toFixed(sigFig)}% `
}
