export function parseGviz(text: string) {
    const start = text.indexOf('{');
    const end = text.lastIndexOf('}');
    return JSON.parse(
        text.slice(start, end + 1)
    );
}
