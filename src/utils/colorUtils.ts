// src/utils/colorUtils.ts
import {simulateColorBlindness} from './colorBlindness';
import {calculateContrastRatio, ensureMinimumContrast} from './contrast';

export type SchemeType =
    | 'monochromatic'
    | 'analogous'
    | 'complementary'
    | 'splitComplementary'
    | 'triadic'
    | 'tetradic'
    | 'square';

export type ColorMode =
    | 'default'
    | 'dark'
    | 'highContrast'
    | 'highContrastDark';

export type ColorBlindnessType =
    | 'none'
    | 'protanopia'
    | 'deuteranopia'
    | 'tritanopia'
    | 'achromatopsia';

export type ColorRole =
    | 'primary'
    | 'secondary'
    | 'accent'
    | 'background'
    | 'surface'
    | 'text'
    | 'border'
    | 'success'
    | 'warning'
    | 'error';

export interface HSL {
    h: number;
    s: number;
    l: number;
}

export interface Color {
    hex: string;
    hsl: HSL;
    rgb: { r: number, g: number, b: number };
    role?: ColorRole;
    name: string;
    isAccessible: boolean;
    contrastRatio: number;
}

/**
 * Converts a hex color string to an HSL object.
 */
export function hexToHSL(hex: string): HSL {
    // Remove any leading '#' and handle shorthand hex codes.
    hex = hex.replace('#', '');
    if (hex.length === 3) {
        hex = hex.split('').map(c => c + c).join('');
    }

    // Convert hex to RGB
    const r = parseInt(hex.substring(0, 2), 16) / 255;
    const g = parseInt(hex.substring(2, 4), 16) / 255;
    const b = parseInt(hex.substring(4, 6), 16) / 255;

    // Find greatest and smallest channel values
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0,
        s = 0;
    const l = (max + min) / 2;

    // Calculate hue and saturation
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

/**
 * Converts an HSL color to a hex string.
 */
export function hslToHex({h, s, l}: HSL): string {
    s /= 100;
    l /= 100;

    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = l - c / 2;

    let r = 0, g = 0, b = 0;

    if (h >= 0 && h < 60) {
        r = c;
        g = x;
        b = 0;
    } else if (h >= 60 && h < 120) {
        r = x;
        g = c;
        b = 0;
    } else if (h >= 120 && h < 180) {
        r = 0;
        g = c;
        b = x;
    } else if (h >= 180 && h < 240) {
        r = 0;
        g = x;
        b = c;
    } else if (h >= 240 && h < 300) {
        r = x;
        g = 0;
        b = c;
    } else if (h >= 300 && h < 360) {
        r = c;
        g = 0;
        b = x;
    }

    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);

    const toHex = (n: number) => {
        const hex = n.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    };

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * Converts HSL to RGB values
 */
export function hslToRgb({h, s, l}: HSL): { r: number, g: number, b: number } {
    s /= 100;
    l /= 100;

    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = l - c / 2;

    let r = 0, g = 0, b = 0;

    if (h >= 0 && h < 60) {
        r = c;
        g = x;
        b = 0;
    } else if (h >= 60 && h < 120) {
        r = x;
        g = c;
        b = 0;
    } else if (h >= 120 && h < 180) {
        r = 0;
        g = c;
        b = x;
    } else if (h >= 180 && h < 240) {
        r = 0;
        g = x;
        b = c;
    } else if (h >= 240 && h < 300) {
        r = x;
        g = 0;
        b = c;
    } else if (h >= 300 && h < 360) {
        r = c;
        g = 0;
        b = x;
    }

    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);

    return {r, g, b};
}

/**
 * Gets a descriptive name for a color
 */
export function getColorName(hsl: HSL): string {
    const {h, s, l} = hsl;

    // Determine luminosity category
    let luminosity = "";
    if (l < 20) luminosity = "very dark";
    else if (l < 40) luminosity = "dark";
    else if (l > 85) luminosity = "very light";
    else if (l > 65) luminosity = "light";

    // Determine saturation category
    let saturation = "";
    if (s < 10) return l < 20 ? "Black" : l > 80 ? "White" : "Gray";
    else if (s < 30) saturation = "grayish";
    else if (s > 80) saturation = "vivid";

    // Determine hue name
    let hue = "";
    if (h >= 0 && h < 15) hue = "Red";
    else if (h >= 15 && h < 45) hue = "Orange";
    else if (h >= 45 && h < 75) hue = "Yellow";
    else if (h >= 75 && h < 105) hue = "Lime";
    else if (h >= 105 && h < 135) hue = "Green";
    else if (h >= 135 && h < 165) hue = "Teal";
    else if (h >= 165 && h < 195) hue = "Cyan";
    else if (h >= 195 && h < 225) hue = "Sky Blue";
    else if (h >= 225 && h < 255) hue = "Blue";
    else if (h >= 255 && h < 285) hue = "Purple";
    else if (h >= 285 && h < 315) hue = "Magenta";
    else if (h >= 315 && h < 345) hue = "Pink";
    else hue = "Red";

    // Build the full name
    let name = "";
    if (luminosity) name += luminosity + " ";
    if (saturation) name += saturation + " ";
    name += hue;

    return name;
}

/**
 * Generates more sophisticated color schemes with enhanced distribution logic
 */
export function generateColorScheme(
    baseHex: string,
    scheme: SchemeType,
    count: number,
    mode: ColorMode = 'default',
    colorBlindness: ColorBlindnessType = 'none'
): Color[] {
    const baseHSL = hexToHSL(baseHex);
    let colors: HSL[] = [];

    // Generate base hues according to scheme type
    switch (scheme) {
        case 'monochromatic': {
            colors = generateMonochromaticScheme(baseHSL, count, mode);
            break;
        }
        case 'analogous': {
            colors = generateAnalogousScheme(baseHSL, count, mode);
            break;
        }
        case 'complementary': {
            colors = generateComplementaryScheme(baseHSL, count, mode);
            break;
        }
        case 'splitComplementary': {
            colors = generateSplitComplementaryScheme(baseHSL, count, mode);
            break;
        }
        case 'triadic': {
            colors = generateTriadicScheme(baseHSL, count, mode);
            break;
        }
        case 'tetradic': {
            colors = generateTetradicScheme(baseHSL, count, mode);
            break;
        }
        case 'square': {
            colors = generateSquareScheme(baseHSL, count, mode);
            break;
        }
    }

    // Apply mode-specific adjustments
    colors = applyColorMode(colors, mode);

    // Convert to full color objects with additional properties
    let colorObjects = colors.map((hsl, index) => {
        const hex = hslToHex(hsl);
        const rgb = hslToRgb(hsl);

        return {
            hex,
            hsl,
            rgb,
            name: getColorName(hsl),
            role: getColorRole(index, count),
            isAccessible: true, // Will be updated when we check contrast
            contrastRatio: 1 // Will be updated when we check contrast
        };
    });

    // Check and fix contrast issues
    colorObjects = ensureColorContrast(colorObjects, mode);

    // Simulate color blindness if needed
    if (colorBlindness !== 'none') {
        colorObjects = colorObjects.map(color => {
            const simulatedRgb = simulateColorBlindness(color.rgb, colorBlindness);
            const simulatedHex = rgbToHex(simulatedRgb);
            // We don't update the HSL since we want to preserve the original values
            return {
                ...color,
                hex: simulatedHex,
                rgb: simulatedRgb
            };
        });
    }

    return colorObjects;
}

/**
 * Convert RGB to hex
 */
function rgbToHex({r, g, b}: { r: number, g: number, b: number }): string {
    const toHex = (n: number) => {
        const hex = Math.round(n).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    };

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * Assign roles to colors based on their position in the palette
 */
function getColorRole(index: number, totalCount: number): ColorRole {
    const commonRoles: ColorRole[] = [
        'primary',
        'secondary',
        'accent',
        'background',
        'surface',
        'text'
    ];

    if (index < commonRoles.length) {
        return commonRoles[index];
    }

    const extendedRoles: ColorRole[] = [
        'border',
        'success',
        'warning',
        'error'
    ];

    const extendedIndex = index - commonRoles.length;
    if (extendedIndex < extendedRoles.length) {
        return extendedRoles[extendedIndex];
    }

    // For any additional colors, cycle through roles
    return commonRoles[index % commonRoles.length];
}

/**
 * Check color contrast and ensure accessibility
 */
function ensureColorContrast(colors: Color[], mode: ColorMode): {
    hex: string;
    hsl: HSL;
    rgb: { r: number; g: number; b: number; };
    name: string;
    role: ColorRole;
    isAccessible: boolean;
    contrastRatio: number;
}[] {
    // Get background and text colors
    const bgIndex = colors.findIndex(c => c.role === 'background');
    const textIndex = colors.findIndex(c => c.role === 'text');

    if (bgIndex < 0 || textIndex < 0 || colors.length < 2) return colors.map(color => ({
        ...color,
        role: color.role || 'primary'
    }));

    const bgColor = colors[bgIndex];
    const textColor = colors[textIndex];

    // Calculate contrast ratio
    const contrastRatio = calculateContrastRatio(bgColor.hex, textColor.hex);

    // Update contrast ratio in both colors
    colors[bgIndex].contrastRatio = contrastRatio;
    colors[textIndex].contrastRatio = contrastRatio;

    // Check if contrast is sufficient based on mode
    const requiredContrast = mode.includes('highContrast') ? 7 : 4.5;

    // If contrast is insufficient, adjust text color
    if (contrastRatio < requiredContrast) {
        const adjustedTextColor = ensureMinimumContrast(
            bgColor.hex,
            textColor.hex,
            requiredContrast
        );

        // Update text color
        if (adjustedTextColor) {
            const adjustedHSL = hexToHSL(adjustedTextColor);
            const adjustedRGB = hslToRgb(adjustedHSL);

            colors[textIndex] = {
                ...colors[textIndex],
                hex: adjustedTextColor,
                hsl: adjustedHSL,
                rgb: adjustedRGB,
                isAccessible: true,
                contrastRatio: requiredContrast
            };

            // Update background color's contrast ratio
            colors[bgIndex].contrastRatio = requiredContrast;
            colors[bgIndex].isAccessible = true;
        } else {
            // Mark as inaccessible if we couldn't fix it
            colors[textIndex].isAccessible = false;
            colors[bgIndex].isAccessible = false;
        }
    } else {
        // Mark as accessible
        colors[textIndex].isAccessible = true;
        colors[bgIndex].isAccessible = true;
    }

    return colors;
}

/**
 * Apply color mode-specific adjustments
 */
function applyColorMode(colors: HSL[], mode: ColorMode): HSL[] {
    switch (mode) {
        case 'dark':
            // Reduce brightness for dark mode
            return colors.map(color => ({
                ...color,
                l: color.l > 50 ?
                    // Darker but preserve some brightness difference
                    Math.max(15, color.l - 40) :
                    Math.max(10, color.l - 20)
            }));

        case 'highContrast':
            // Increase saturation and ensure high contrast between colors
            return colors.map(color => ({
                ...color,
                s: Math.min(100, color.s * 1.3), // More saturation
                l: color.l < 40 ? Math.max(10, color.l - 10) : Math.min(90, color.l + 10) // Push towards extremes
            }));

        case 'highContrastDark':
            // Combine high contrast and dark mode adjustments
            return colors.map(color => ({
                ...color,
                s: Math.min(100, color.s * 1.3), // More saturation
                l: color.l > 50 ?
                    // Darker but preserve contrast
                    Math.max(30, color.l - 30) :
                    Math.max(5, color.l - 15)
            }));

        default:
            // Default mode, no adjustments needed
            return colors;
    }
}

/**
 * Generate monochromatic color scheme with improved distribution
 */
function generateMonochromaticScheme(baseHSL: HSL, count: number, mode: ColorMode): HSL[] {
    const {h, s} = baseHSL;
    const colors: HSL[] = [];

    // For monochromatic schemes, we vary the lightness in a way that ensures good distribution
    // Start with dark colors and progressively get lighter
    const baseLightness = mode.includes('dark') ? 30 : 50;

    if (count === 1) {
        return [{h, s, l: baseLightness}];
    }

    // Create a gradient of lightness values
    for (let i = 0; i < count; i++) {
        // Calculate lightness with Golden Ratio distribution for better visual spacing
        // Range from 15% to 85% for better visibility
        const t = i / (count - 1);
        const l = mode.includes('dark') ?
            15 + 40 * t : // 15% to 55% for dark mode
            20 + 65 * t;  // 20% to 85% for light mode

        colors.push({h, s, l});
    }

    return colors;
}


/**
 * Generate analogous color scheme with improved distribution
 */
function generateAnalogousScheme(baseHSL: HSL, count: number, mode: ColorMode): HSL[] {
    const {h, s, l} = baseHSL;
    const colors: HSL[] = [];

    // Analogous colors are adjacent on the color wheel, typically within 30° on either side
    // For a more aesthetically pleasing result, we'll use a 60° range

    if (count === 1) {
        return [{h, s, l}];
    }

    // Calculate the optimal distribution across the 60° range
    const angleRange = 60;
    const startAngle = (h - angleRange / 2 + 360) % 360;

    for (let i = 0; i < count; i++) {
        const angle = (startAngle + (i * angleRange) / (count - 1)) % 360;

        // Adjust saturation slightly for more variety
        const saturationAdjust = mode.includes('highContrast') ? 0 : -10 + (i * 20) / (count - 1);
        const newS = Math.max(0, Math.min(100, s + saturationAdjust));

        // Adjust lightness for better distinction
        const lightnessAdjust = -5 + (i * 10) / (count - 1);
        const newL = Math.max(0, Math.min(100, l + lightnessAdjust));

        colors.push({h: angle, s: newS, l: newL});
    }

    return colors;
}

/**
 * Generate complementary color scheme with improved distribution
 */
function generateComplementaryScheme(baseHSL: HSL, count: number, mode: ColorMode): HSL[] {
    const {h, s, l} = baseHSL;
    const colors: HSL[] = [];

    // Complementary colors are opposite on the color wheel (180° apart)
    const complementaryH = (h + 180) % 360;

    if (count === 1) {
        return [{h, s, l}];
    }

    if (count === 2) {
        // Just the base color and its complement
        return [
            {h, s, l},
            {h: complementaryH, s, l}
        ];
    }

    // For more than 2 colors, distribute them between the base color and its complement
    const baseCount = Math.ceil(count / 2);
    const complementCount = count - baseCount;

    // Generate colors around the base hue
    for (let i = 0; i < baseCount; i++) {
        // Add slight variations to the base hue
        const hueAdjust = baseCount > 1 ? -15 + (i * 30) / (baseCount - 1) : 0;
        const newH = (h + hueAdjust + 360) % 360;

        // Vary saturation and lightness slightly for visual interest
        const saturationAdjust = mode.includes('highContrast') ? 0 : -5 + (i * 10) / Math.max(1, baseCount - 1);
        const lightnessAdjust = -7 + (i * 14) / Math.max(1, baseCount - 1);

        colors.push({
            h: newH,
            s: Math.max(0, Math.min(100, s + saturationAdjust)),
            l: Math.max(0, Math.min(100, l + lightnessAdjust))
        });
    }

    // Generate colors around the complementary hue
    for (let i = 0; i < complementCount; i++) {
        // Add slight variations to the complementary hue
        const hueAdjust = complementCount > 1 ? -15 + (i * 30) / (complementCount - 1) : 0;
        const newH = (complementaryH + hueAdjust + 360) % 360;

        // Vary saturation and lightness slightly for visual interest
        const saturationAdjust = mode.includes('highContrast') ? 0 : -5 + (i * 10) / Math.max(1, complementCount - 1);
        const lightnessAdjust = -7 + (i * 14) / Math.max(1, complementCount - 1);

        colors.push({
            h: newH,
            s: Math.max(0, Math.min(100, s + saturationAdjust)),
            l: Math.max(0, Math.min(100, l + lightnessAdjust))
        });
    }

    return colors;
}

/**
 * Generate split-complementary color scheme with improved distribution
 */
function generateSplitComplementaryScheme(baseHSL: HSL, count: number, mode: ColorMode): HSL[] {
    const {h, s, l} = baseHSL;
    const colors: HSL[] = [];

    // Split-complementary uses the base color and two colors adjacent to its complement
    // Typically these are 150° and 210° from the base color (or equivalently ±30° from the complement)
    const complementaryH = (h + 180) % 360;
    const splitComplement1 = (complementaryH - 30 + 360) % 360;
    const splitComplement2 = (complementaryH + 30) % 360;

    if (count === 1) {
        return [{h, s, l}];
    }

    if (count === 3) {
        // Classic split-complementary with exactly three colors
        return [
            {h, s, l},
            {h: splitComplement1, s, l},
            {h: splitComplement2, s, l}
        ];
    }

    // For other counts, distribute colors across the three main hues
    const baseCount = Math.ceil(count / 3);
    const split1Count = Math.floor(count / 3);
    const split2Count = count - baseCount - split1Count;

    // Generate colors around the base hue
    for (let i = 0; i < baseCount; i++) {
        // Add slight variations to the base hue
        const hueAdjust = baseCount > 1 ? -10 + (i * 20) / (baseCount - 1) : 0;
        const newH = (h + hueAdjust + 360) % 360;

        // Vary saturation and lightness slightly
        const saturationAdjust = mode.includes('highContrast') ? 0 : -5 + (i * 10) / Math.max(1, baseCount - 1);
        const lightnessAdjust = -7 + (i * 14) / Math.max(1, baseCount - 1);

        colors.push({
            h: newH,
            s: Math.max(0, Math.min(100, s + saturationAdjust)),
            l: Math.max(0, Math.min(100, l + lightnessAdjust))
        });
    }

    // Generate colors around the first split complement
    for (let i = 0; i < split1Count; i++) {
        // Add slight variations to the split complementary hue
        const hueAdjust = split1Count > 1 ? -10 + (i * 20) / (split1Count - 1) : 0;
        const newH = (splitComplement1 + hueAdjust + 360) % 360;

        // Vary saturation and lightness
        const saturationAdjust = mode.includes('highContrast') ? 0 : -5 + (i * 10) / Math.max(1, split1Count - 1);
        const lightnessAdjust = -7 + (i * 14) / Math.max(1, split1Count - 1);

        colors.push({
            h: newH,
            s: Math.max(0, Math.min(100, s + saturationAdjust)),
            l: Math.max(0, Math.min(100, l + lightnessAdjust))
        });
    }

    // Generate colors around the second split complement
    for (let i = 0; i < split2Count; i++) {
        // Add slight variations to the split complementary hue
        const hueAdjust = split2Count > 1 ? -10 + (i * 20) / (split2Count - 1) : 0;
        const newH = (splitComplement2 + hueAdjust + 360) % 360;

        // Vary saturation and lightness
        const saturationAdjust = mode.includes('highContrast') ? 0 : -5 + (i * 10) / Math.max(1, split2Count - 1);
        const lightnessAdjust = -7 + (i * 14) / Math.max(1, split2Count - 1);

        colors.push({
            h: newH,
            s: Math.max(0, Math.min(100, s + saturationAdjust)),
            l: Math.max(0, Math.min(100, l + lightnessAdjust))
        });
    }

    return colors;
}

/**
 * Generate triadic color scheme with improved distribution
 */
function generateTriadicScheme(baseHSL: HSL, count: number, mode: ColorMode): HSL[] {
    const {h, s, l} = baseHSL;
    const colors: HSL[] = [];

    // Triadic colors are evenly spaced around the color wheel, 120° apart
    const triad1 = (h + 120) % 360;
    const triad2 = (h + 240) % 360;

    if (count === 1) {
        return [{h, s, l}];
    }

    if (count === 3) {
        // Classic triadic with exactly three colors
        return [
            {h, s, l},
            {h: triad1, s, l},
            {h: triad2, s, l}
        ];
    }

    // For other counts, distribute colors across the three main hues
    const baseCount = Math.ceil(count / 3);
    const triad1Count = Math.floor(count / 3);
    const triad2Count = count - baseCount - triad1Count;

    // Generate colors around the base hue
    for (let i = 0; i < baseCount; i++) {
        // Add slight variations to the base hue
        const hueAdjust = baseCount > 1 ? -15 + (i * 30) / (baseCount - 1) : 0;
        const newH = (h + hueAdjust + 360) % 360;

        // Vary saturation and lightness
        const saturationAdjust = mode.includes('highContrast') ? 0 : -5 + (i * 10) / Math.max(1, baseCount - 1);
        const lightnessAdjust = -7 + (i * 14) / Math.max(1, baseCount - 1);

        colors.push({
            h: newH,
            s: Math.max(0, Math.min(100, s + saturationAdjust)),
            l: Math.max(0, Math.min(100, l + lightnessAdjust))
        });
    }

    // Generate colors around the first triad
    for (let i = 0; i < triad1Count; i++) {
        // Add slight variations to the triad hue
        const hueAdjust = triad1Count > 1 ? -15 + (i * 30) / (triad1Count - 1) : 0;
        const newH = (triad1 + hueAdjust + 360) % 360;

        // Vary saturation and lightness
        const saturationAdjust = mode.includes('highContrast') ? 0 : -5 + (i * 10) / Math.max(1, triad1Count - 1);
        const lightnessAdjust = -7 + (i * 14) / Math.max(1, triad1Count - 1);

        colors.push({
            h: newH,
            s: Math.max(0, Math.min(100, s + saturationAdjust)),
            l: Math.max(0, Math.min(100, l + lightnessAdjust))
        });
    }

    // Generate colors around the second triad
    for (let i = 0; i < triad2Count; i++) {
        // Add slight variations to the triad hue
        const hueAdjust = triad2Count > 1 ? -15 + (i * 30) / (triad2Count - 1) : 0;
        const newH = (triad2 + hueAdjust + 360) % 360;

        // Vary saturation and lightness
        const saturationAdjust = mode.includes('highContrast') ? 0 : -5 + (i * 10) / Math.max(1, triad2Count - 1);
        const lightnessAdjust = -7 + (i * 14) / Math.max(1, triad2Count - 1);

        colors.push({
            h: newH,
            s: Math.max(0, Math.min(100, s + saturationAdjust)),
            l: Math.max(0, Math.min(100, l + lightnessAdjust))
        });
    }

    return colors;
}

/**
 * Generate tetradic (rectangular) color scheme with improved distribution
 */
function generateTetradicScheme(baseHSL: HSL, count: number, mode: ColorMode): HSL[] {
    const {h, s, l} = baseHSL;
    const colors: HSL[] = [];

    // Tetradic uses four colors arranged in a rectangle on the color wheel
    // These are typically 60° apart, then 120°, then 60° (or equivalently 60° and 180° pairs)
    const tetrad1 = (h + 60) % 360;
    const tetrad2 = (h + 180) % 360;
    const tetrad3 = (h + 240) % 360;

    if (count === 1) {
        return [{h, s, l}];
    }

    if (count === 4) {
        // Classic tetradic with exactly four colors
        return [
            {h, s, l},
            {h: tetrad1, s, l},
            {h: tetrad2, s, l},
            {h: tetrad3, s, l}
        ];
    }

    // For other counts, distribute colors across the four main hues
    const baseCount = Math.ceil(count / 4);
    const t1Count = Math.floor(count / 4);
    const t2Count = Math.floor(count / 4);
    const t3Count = count - baseCount - t1Count - t2Count;

    // Generate colors around the base hue
    for (let i = 0; i < baseCount; i++) {
        const hueAdjust = baseCount > 1 ? -10 + (i * 20) / (baseCount - 1) : 0;
        const newH = (h + hueAdjust + 360) % 360;

        // Vary saturation and lightness
        const saturationAdjust = mode.includes('highContrast') ? 0 : -5 + (i * 10) / Math.max(1, baseCount - 1);
        const lightnessAdjust = -5 + (i * 10) / Math.max(1, baseCount - 1);

        colors.push({
            h: newH,
            s: Math.max(0, Math.min(100, s + saturationAdjust)),
            l: Math.max(0, Math.min(100, l + lightnessAdjust))
        });
    }

    // Generate colors around the first tetrad
    for (let i = 0; i < t1Count; i++) {
        const hueAdjust = t1Count > 1 ? -10 + (i * 20) / (t1Count - 1) : 0;
        const newH = (tetrad1 + hueAdjust + 360) % 360;

        // Vary saturation and lightness
        const saturationAdjust = mode.includes('highContrast') ? 0 : -5 + (i * 10) / Math.max(1, t1Count - 1);
        const lightnessAdjust = -5 + (i * 10) / Math.max(1, t1Count - 1);

        colors.push({
            h: newH,
            s: Math.max(0, Math.min(100, s + saturationAdjust)),
            l: Math.max(0, Math.min(100, l + lightnessAdjust))
        });
    }

    // Generate colors around the second tetrad
    for (let i = 0; i < t2Count; i++) {
        const hueAdjust = t2Count > 1 ? -10 + (i * 20) / (t2Count - 1) : 0;
        const newH = (tetrad2 + hueAdjust + 360) % 360;

        // Vary saturation and lightness
        const saturationAdjust = mode.includes('highContrast') ? 0 : -5 + (i * 10) / Math.max(1, t2Count - 1);
        const lightnessAdjust = -5 + (i * 10) / Math.max(1, t2Count - 1);

        colors.push({
            h: newH,
            s: Math.max(0, Math.min(100, s + saturationAdjust)),
            l: Math.max(0, Math.min(100, l + lightnessAdjust))
        });
    }

    // Generate colors around the third tetrad
    for (let i = 0; i < t3Count; i++) {
        const hueAdjust = t3Count > 1 ? -10 + (i * 20) / (t3Count - 1) : 0;
        const newH = (tetrad3 + hueAdjust + 360) % 360;

        // Vary saturation and lightness
        const saturationAdjust = mode.includes('highContrast') ? 0 : -5 + (i * 10) / Math.max(1, t3Count - 1);
        const lightnessAdjust = -5 + (i * 10) / Math.max(1, t3Count - 1);

        colors.push({
            h: newH,
            s: Math.max(0, Math.min(100, s + saturationAdjust)),
            l: Math.max(0, Math.min(100, l + lightnessAdjust))
        });
    }

    return colors;
}

/**
 * Generate square color scheme with improved distribution
 */
function generateSquareScheme(baseHSL: HSL, count: number, mode: ColorMode): HSL[] {
    const {h, s, l} = baseHSL;
    const colors: HSL[] = [];

    // Square scheme uses four colors evenly spaced at 90° intervals
    const square1 = (h + 90) % 360;
    const square2 = (h + 180) % 360;
    const square3 = (h + 270) % 360;

    if (count === 1) {
        return [{h, s, l}];
    }

    if (count === 4) {
        // Classic square with exactly four colors
        return [
            {h, s, l},
            {h: square1, s, l},
            {h: square2, s, l},
            {h: square3, s, l}
        ];
    }

    // For other counts, distribute colors across the four main hues
    const baseCount = Math.ceil(count / 4);
    const s1Count = Math.floor(count / 4);
    const s2Count = Math.floor(count / 4);
    const s3Count = count - baseCount - s1Count - s2Count;

    // Generate colors around the base hue
    for (let i = 0; i < baseCount; i++) {
        const hueAdjust = baseCount > 1 ? -10 + (i * 20) / (baseCount - 1) : 0;
        const newH = (h + hueAdjust + 360) % 360;

        // Vary saturation and lightness
        const saturationAdjust = mode.includes('highContrast') ? 0 : -5 + (i * 10) / Math.max(1, baseCount - 1);
        const lightnessAdjust = -5 + (i * 10) / Math.max(1, baseCount - 1);

        colors.push({
            h: newH,
            s: Math.max(0, Math.min(100, s + saturationAdjust)),
            l: Math.max(0, Math.min(100, l + lightnessAdjust))
        });
    }

    // Generate colors around the first square
    for (let i = 0; i < s1Count; i++) {
        const hueAdjust = s1Count > 1 ? -10 + (i * 20) / (s1Count - 1) : 0;
        const newH = (square1 + hueAdjust + 360) % 360;

        // Vary saturation and lightness
        const saturationAdjust = mode.includes('highContrast') ? 0 : -5 + (i * 10) / Math.max(1, s1Count - 1);
        const lightnessAdjust = -5 + (i * 10) / Math.max(1, s1Count - 1);

        colors.push({
            h: newH,
            s: Math.max(0, Math.min(100, s + saturationAdjust)),
            l: Math.max(0, Math.min(100, l + lightnessAdjust))
        });
    }

    // Generate colors around the second square
    for (let i = 0; i < s2Count; i++) {
        const hueAdjust = s2Count > 1 ? -10 + (i * 20) / (s2Count - 1) : 0;
        const newH = (square2 + hueAdjust + 360) % 360;

        // Vary saturation and lightness
        const saturationAdjust = mode.includes('highContrast') ? 0 : -5 + (i * 10) / Math.max(1, s2Count - 1);
        const lightnessAdjust = -5 + (i * 10) / Math.max(1, s2Count - 1);

        colors.push({
            h: newH,
            s: Math.max(0, Math.min(100, s + saturationAdjust)),
            l: Math.max(0, Math.min(100, l + lightnessAdjust))
        });
    }

    // Generate colors around the third square
    for (let i = 0; i < s3Count; i++) {
        const hueAdjust = s3Count > 1 ? -10 + (i * 20) / (s3Count - 1) : 0;
        const newH = (square3 + hueAdjust + 360) % 360;

        // Vary saturation and lightness
        const saturationAdjust = mode.includes('highContrast') ? 0 : -5 + (i * 10) / Math.max(1, s3Count - 1);
        const lightnessAdjust = -5 + (i * 10) / Math.max(1, s3Count - 1);

        colors.push({
            h: newH,
            s: Math.max(0, Math.min(100, s + saturationAdjust)),
            l: Math.max(0, Math.min(100, l + lightnessAdjust))
        });
    }

    return colors;
}
