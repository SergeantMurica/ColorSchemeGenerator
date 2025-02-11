// src/utils/colorUtils.ts
export type SchemeType =
    | 'monochromatic'
    | 'analogous'
    | 'complementary'
    | 'splitComplementary'
    | 'triadic'
    | 'tetradic';

export type RoleType =
    | 'Background'
    | 'Text'
    | 'Border'
    | 'Highlight'
    | 'Accent'
    | 'CTA'
    | 'Link'
    | 'Success'
    | 'Warning'
    | 'Error'
    | 'Info'
    | 'Disabled'
    | 'Secondary'
    | 'Overlay';

interface HSL {
    h: number;
    s: number;
    l: number;
}

/** Converts a hex color string to an HSL object. */
export function hexToHSL(hex: string): HSL {
    hex = hex.replace('#', '');
    if (hex.length === 3) {
        hex = hex.split('').map(c => c + c).join('');
    }
    const r = parseInt(hex.substring(0, 2), 16) / 255;
    const g = parseInt(hex.substring(2, 4), 16) / 255;
    const b = parseInt(hex.substring(4, 6), 16) / 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    // eslint-disable-next-line prefer-const
    let h = 0, s = 0, l = (max + min) / 2;
    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / d + 2;
                break;
            case b:
                h = (r - g) / d + 4;
                break;
        }
        h *= 60;
    }
    return {h, s: s * 100, l: l * 100};
}

/** Helper: Converts an HSL object to a hex color string. */
function hueToRGB(p: number, q: number, t: number): number {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
}

/** Converts an HSL object to a hex color string. */
export function hslToHex({h, s, l}: HSL): string {
    s /= 100;
    l /= 100;
    let r: number, g: number, b: number;
    if (s === 0) {
        r = g = b = l;
    } else {
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hueToRGB(p, q, h / 360 + 1 / 3);
        g = hueToRGB(p, q, h / 360);
        b = hueToRGB(p, q, h / 360 - 1 / 3);
    }
    const toHex = (x: number) => {
        const hex = Math.round(x * 255).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    };
    return '#' + toHex(r) + toHex(g) + toHex(b);
}

/** Generates a color scheme based on the given baseHex, scheme type, and count. */
export function generateColorScheme(baseHex: string, scheme: SchemeType, count: number): string[] {
    const {h, s} = hexToHSL(baseHex);
    let baseHues: number[] = [];
    switch (scheme) {
        case 'monochromatic':
            baseHues = [h];
            break;
        case 'analogous':
            if (count === 1) baseHues = [h];
            else {
                const range = 30;
                const step = range / (count - 1);
                baseHues = Array.from({length: count}, (_, i) => (h - range / 2 + i * step + 360) % 360);
            }
            break;
        case 'complementary':
            if (count === 1) baseHues = [h];
            else if (count === 2) baseHues = [h, (h + 180) % 360];
            else {
                const count1 = Math.floor(count / 2);
                const count2 = count - count1;
                baseHues = [
                    ...Array.from({length: count1}, (_, i) => (h + (i - (count1 - 1) / 2) * 5 + 360) % 360),
                    ...Array.from({length: count2}, (_, i) => ((h + 180) + (i - (count2 - 1) / 2) * 5 + 360) % 360),
                ];
            }
            break;
        case 'splitComplementary':
            if (count === 1) baseHues = [h];
            else if (count === 2) baseHues = [(h + 150) % 360, (h + 210) % 360];
            else {
                const count1 = Math.floor(count / 2);
                const count2 = count - count1;
                baseHues = [
                    ...Array.from({length: count1}, (_, i) => ((h + 150) + (i - (count1 - 1) / 2) * 5 + 360) % 360),
                    ...Array.from({length: count2}, (_, i) => ((h + 210) + (i - (count2 - 1) / 2) * 5 + 360) % 360),
                ];
            }
            break;
        case 'triadic':
            if (count === 1) baseHues = [h];
            else if (count <= 3) baseHues = Array.from({length: count}, (_, i) => (h + i * 120) % 360);
            else {
                const groupSize = Math.floor(count / 3);
                const remainder = count % 3;
                baseHues = [];
                for (let i = 0; i < 3; i++) {
                    const groupCount = groupSize + (i < remainder ? 1 : 0);
                    const baseHue = (h + i * 120) % 360;
                    for (let j = 0; j < groupCount; j++) {
                        baseHues.push((baseHue + (j - (groupCount - 1) / 2) * 5 + 360) % 360);
                    }
                }
            }
            break;
        case 'tetradic':
            if (count === 1) baseHues = [h];
            else if (count <= 4) baseHues = Array.from({length: count}, (_, i) => (h + i * 90) % 360);
            else {
                const groupSize = Math.floor(count / 4);
                const remainder = count % 4;
                baseHues = [];
                for (let i = 0; i < 4; i++) {
                    const groupCount = groupSize + (i < remainder ? 1 : 0);
                    const baseHue = (h + i * 90) % 360;
                    for (let j = 0; j < groupCount; j++) {
                        baseHues.push((baseHue + (j - (groupCount - 1) / 2) * 5 + 360) % 360);
                    }
                }
            }
            break;
    }
    if (scheme === 'monochromatic') {
        if (count === 1) return [baseHex];
        return Array.from({length: count}, (_, i) => {
            const newL = 20 + i * (60 / (count - 1));
            return hslToHex({h, s, l: newL});
        });
    } else {
        return baseHues.map(hue => hslToHex({h: hue, s, l: 50}));
    }
}

/** Adjusts a base color for a given role type and occurrence index. */
export function adjustColorForRole(color: string, roleType: RoleType, roleIndex: number): string {
    const hsl = hexToHSL(color);
    switch (roleType) {
        case 'Background':
            hsl.l = Math.min(95, 90 - roleIndex * 2);
            break;
        case 'Text':
            hsl.l = Math.max(5, 15 + roleIndex * 3);
            break;
        case 'Border':
            hsl.l = Math.min(70, 50 + roleIndex * 2);
            break;
        case 'Highlight':
            hsl.l = Math.min(90, 60 - roleIndex * 3);
            break;
        case 'Accent':
            hsl.l = 55 - roleIndex * 2;
            hsl.s = Math.min(100, hsl.s + 10);
            break;
        case 'CTA':
            hsl.l = 45 - roleIndex * 2;
            hsl.s = Math.min(100, hsl.s + 15);
            break;
        case 'Link':
            hsl.h = (hsl.h + 20) % 360;
            hsl.l = 50 - roleIndex * 2;
            break;
        case 'Success':
            hsl.h = 120;
            hsl.l = 40 + roleIndex * 2;
            hsl.s = Math.min(100, hsl.s + 10);
            break;
        case 'Warning':
            hsl.h = 35;
            hsl.l = 50 + roleIndex * 2;
            hsl.s = Math.min(100, hsl.s + 10);
            break;
        case 'Error':
            hsl.h = 0;
            hsl.l = 50 - roleIndex * 2;
            hsl.s = Math.min(100, hsl.s + 10);
            break;
        case 'Info':
            hsl.h = 200;
            hsl.l = 50 - roleIndex * 2;
            hsl.s = Math.min(100, hsl.s + 10);
            break;
        case 'Disabled':
            hsl.s = 0;
            hsl.l = 70 + roleIndex * 2;
            break;
        case 'Secondary':
            hsl.l = Math.max(5, 25 + roleIndex * 3);
            break;
        case 'Overlay':
            hsl.l = Math.max(0, 20 - roleIndex * 2);
            break;
        default:
            break;
    }
    return hslToHex(hsl);
}

/** Generates a dark variant of the given color by reducing lightness. */
export function generateDarkColor(color: string): string {
    const hsl = hexToHSL(color);
    hsl.l = Math.max(0, hsl.l - 30);
    return hslToHex(hsl);
}

/** Generates a high-contrast variant by boosting saturation and adjusting lightness. */
export function generateHighContrastColor(color: string): string {
    const hsl = hexToHSL(color);
    hsl.s = Math.min(100, hsl.s + 20);
    hsl.l = hsl.l < 50 ? 20 : 80;
    return hslToHex(hsl);
}

/** Generates a colorblind variant based on a selected mode. */
export function generateColorblindColor(color: string, mode: string): string {
    const hsl = hexToHSL(color);
    switch (mode) {
        case "protanopia":
            hsl.h = (hsl.h + 15) % 360;
            break;
        case "deuteranopia":
            hsl.h = (hsl.h + 345) % 360;
            break;
        case "tritanopia":
            hsl.h = (hsl.h + 30) % 360;
            break;
        case "achromatopsia":
            hsl.s = 0;
            break;
        default:
            break;
    }
    return hslToHex(hsl);
}