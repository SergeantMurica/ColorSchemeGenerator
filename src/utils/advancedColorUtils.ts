import {Color, HSL, hslToRgb, hslToHex, ColorRole, getColorName} from './colorUtils';

/**
 * Generate shadow colors based on a base color
 */
export function generateShadowColors(baseColor: Color): { light: Color, medium: Color, dark: Color } {
    const { h, s } = baseColor.hsl;

    // Shadow colors are typically darker and less saturated
    const lightShadow: HSL = { h, s: Math.max(0, s - 20), l: Math.max(0, baseColor.hsl.l - 10) };
    const mediumShadow: HSL = { h, s: Math.max(0, s - 25), l: Math.max(0, baseColor.hsl.l - 20) };
    const darkShadow: HSL = { h, s: Math.max(0, s - 30), l: Math.max(0, baseColor.hsl.l - 30) };

    return {
        light: createColorObject(lightShadow, 'shadow-light'),
        medium: createColorObject(mediumShadow, 'shadow-medium'),
        dark: createColorObject(darkShadow, 'shadow-dark')
    };
}

/**
 * Generate modal overlay color with transparency
 */
export function generateModalOverlay(baseColor: Color): {
    hex: string;
    hsl: HSL;
    rgb: { r: number; g: number; b: number };
    role: string;
    name: string;
    isAccessible: boolean;
    contrastRatio: number;
    alpha: number
} {
    const { r, g, b } = baseColor.rgb;
    return {
        hex: `rgba(${r}, ${g}, ${b}, 0.5)`,
        hsl: baseColor.hsl,
        rgb: baseColor.rgb,
        role: 'modal-overlay',
        name: `${baseColor.name} (50% Opacity)`,
        isAccessible: true,
        contrastRatio: 1,
        alpha: 0.5
    };
}

/**
 * Generate blur overlay color
 */
export function generateBlurOverlay(baseColor: Color): Color {
    const { h, s } = baseColor.hsl;
    const blurHSL: HSL = { h, s: Math.max(0, s - 15), l: 95 };

    const blurColor = createColorObject(blurHSL, 'blur-overlay');
    blurColor.hex = `rgba(${blurColor.rgb.r}, ${blurColor.rgb.g}, ${blurColor.rgb.b}, 0.8)`;
    blurColor.alpha = 0.8;

    return blurColor;
}

/**
 * Generate focus ring color
 */
export function generateFocusRing(accentColor: Color): Color {
    const { h, s } = accentColor.hsl;
    const focusHSL: HSL = { h, s: Math.min(100, s + 10), l: Math.min(70, accentColor.hsl.l + 15) };

    return createColorObject(focusHSL, 'focus-ring');
}

/**
 * Helper to create a full Color object from HSL
 */
function createColorObject(hsl: HSL, role: string): Color {
    const hex = hslToHex(hsl);
    const rgb = hslToRgb(hsl);

    return {
        hex,
        hsl,
        rgb,
        role: role as ColorRole,
        name: getColorName(hsl),
        isAccessible: true,
        contrastRatio: 1
    };
}

