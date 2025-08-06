

export function formatSeconds(seconds: number, pad: string = '0'): string {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, pad)}`;
}

export function formatDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
}

export function formatDatetime(date: Date): string {
    const hourRaw = date.getHours();
    const hour = String(hourRaw % 12 === 0 ? 12 : hourRaw % 12);
    const minute = String(date.getMinutes()).padStart(2, '0');
    const ampm = hourRaw >= 12 ? 'PM' : 'AM';
    return `${formatDate(date)} ${hour}:${minute} ${ampm}`;
}


export function convertFromGoogleSheetsDateString(dateString: string): Date {
    const match = dateString.match(/Date\((\d+),(\d+),(\d+)(?:,(\d+),(\d+),(\d+))?\)/);
    if (!match) return new Date();

    const year = Number(match[1]);
    const month = Number(match[2]); // 0-indexed
    const day = Number(match[3]);
    const hour = Number(match[4] ?? 0);
    const minute = Number(match[5] ?? 0);
    const second = Number(match[6] ?? 0);

    return new Date(year, month, day, hour, minute, second);
}

export function combineDateAndTime(date: Date, time: Date): Date {
    const combined = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        time.getHours(),
        time.getMinutes(),
        time.getSeconds(),
        time.getMilliseconds()
    );

    return combined
}

export function currentHour(): Date {
    const rightNow = new Date();
    rightNow.setMinutes(0, 0, 0);
    return rightNow;
}

export function formatPercent(value: number, figures?: number): string {
    let sigFig = figures ? figures : 2;
    return `${(value * 100).toFixed(sigFig)}% `
}
