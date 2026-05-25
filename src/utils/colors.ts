export function resolveCssVar(value: string): string {
    if (!value.startsWith("var(")) {
        return value;
    }

    const styles =
        getComputedStyle(document.documentElement);

    const varName = value
        .replace("var(", "")
        .replace(")", "")
        .trim();

    return styles.getPropertyValue(varName).trim();
}

export function toRgb(color: string): string {
    const el = document.createElement("div");
    el.style.color = color;
    document.body.appendChild(el);

    const computed = getComputedStyle(el).color; // may still be oklch

    document.body.removeChild(el);

    // FORCE conversion by re-applying as computed RGB target
    const temp = document.createElement("div");
    temp.style.color = computed;
    document.body.appendChild(temp);

    const rgb = getComputedStyle(temp).color;

    document.body.removeChild(temp);
    return rgb; // now guaranteed rgb(...)
}

export function LerpColor(from_color: string, to_color: string, mix: number): string {

    // Clamp mix between 0 and 1
    mix = Math.max(0, Math.min(1, mix));

    // Remove #
    const from = from_color.replace("#", "");
    const to = to_color.replace("#", "");

    // Parse hex colors
    const from_r = parseInt(from.substring(0, 2), 16);
    const from_g = parseInt(from.substring(2, 4), 16);
    const from_b = parseInt(from.substring(4, 6), 16);

    const to_r = parseInt(to.substring(0, 2), 16);
    const to_g = parseInt(to.substring(2, 4), 16);
    const to_b = parseInt(to.substring(4, 6), 16);

    // Interpolate
    const r = Math.round(from_r + (to_r - from_r) * mix);
    const g = Math.round(from_g + (to_g - from_g) * mix);
    const b = Math.round(from_b + (to_b - from_b) * mix);

    // Convert back to hex
    const hex = (value: number) => value.toString(16).padStart(2, "0");

    return `#${hex(r)}${hex(g)}${hex(b)}`;
}
