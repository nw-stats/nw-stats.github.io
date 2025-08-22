import { DateTime } from 'luxon';

export function formatSeconds(seconds: number, pad: string = '0'): string {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, pad)}`;
}

export function formatDate(date: DateTime): string {
    return date.setZone("local").toFormat("MM/dd/yyyy");
}

export function formatTime(date: DateTime): string {
    const localDt = date.setZone("local");
    return localDt.toLocaleString(DateTime.TIME_SIMPLE) + ' ' +
        localDt.toLocaleString({ timeZoneName: 'short' }).split(' ').pop();
}

export function formatDatetime(date: DateTime): string {
    return `${formatDate(date)} ${formatTime(date)}`;
}

export function formatDateTimeSlug(date: DateTime): string {
    const localDt = date.setZone("local");
    const fd = localDt.toFormat("yyyyMMdd");
    const ft = localDt.toLocaleString(DateTime.TIME_24_SIMPLE).replaceAll(":", "");
    return `${fd}_${ft}`;
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


export function sortByDateThenTime(a: DateTime, b: DateTime): number {
    // Convert to a unified zone (UTC here)
    const utcA = a.setZone("utc");
    const utcB = b.setZone("utc");

    // Compare date first
    const dateA = utcA.startOf("day").toMillis();
    const dateB = utcB.startOf("day").toMillis();
    if (dateA !== dateB) {
        return dateB - dateA; // latest date first
    }

    // If same date, compare time (earlier time first)
    const timeA = utcA.hour * 3600 + utcA.minute * 60 + utcA.second;
    const timeB = utcB.hour * 3600 + utcB.minute * 60 + utcB.second;

    return timeA - timeB; // earlier time first
}
