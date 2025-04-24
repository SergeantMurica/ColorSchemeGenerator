/**
 * Calculate relative luminance of a color according to WCAG 2.0
 */
export function getLuminance(hex: string): number {
    // Remove # if present
    hex = hex.replace('#', '');

    // Convert to RGB
    const r = parseInt(hex.substring(0, 2), 16) / 255;
    const g = parseInt(hex.substring(2, 4), 16) / 255;
    const b = parseInt(hex.substring(4, 6), 16) / 255;

    // Calculate luminance
    const R = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
    const G = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
    const B = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);

    return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

/**
 * Calculate the contrast ratio between two colors according to WCAG 2.0
 */
export function calculateContrastRatio(color1: string, color2: string): number {
    const luminance1 = getLuminance(color1);
    const luminance2 = getLuminance(color2);

    // Determine the lighter and darker of the colors
    const lighter = Math.max(luminance1, luminance2);
    const darker = Math.min(luminance1, luminance2);

    // Calculate contrast ratio: (L1 + 0.05) / (L2 + 0.05)
    return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Adjust a color to ensure minimum contrast with another color
 */
export function ensureMinimumContrast(
    bgColor: string,
    textColor: string,
    targetContrast: number = 4.5
): string | null {
    const hexToRgb = (hex: string) => {
        const r = parseInt(hex.substring(1, 3), 16);
        const g = parseInt(hex.substring(3, 5), 16);
        const b = parseInt(hex.substring(5, 7), 16);
        return {r, g, b};
    };

    const rgbToHex = (r: number, g: number, b: number) => {
        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    };

    const initialContrast = calculateContrastRatio(bgColor, textColor);

    // If we already meet the contrast requirement, return the original color
    if (initialContrast >= targetContrast) {
        return textColor;
    }

    // Get luminance of both colors
    const bgLuminance = getLuminance(bgColor);

    // Determine if we should make the text lighter or darker
    const shouldLighten = bgLuminance < 0.5;

    // Original RGB values
    const textRgb = hexToRgb(textColor);

    // Adjust the color in increments to find a suitable contrast
    const maxIterations = 100;
    const stepSize = shouldLighten ? 5 : -5;

    for (let i = 1; i <= maxIterations; i++) {
        const newR = Math.max(0, Math.min(255, textRgb.r + stepSize * i));
        const newG = Math.max(0, Math.min(255, textRgb.g + stepSize * i));
        const newB = Math.max(0, Math.min(255, textRgb.b + stepSize * i));

        const newHex = rgbToHex(newR, newG, newB);
        const newContrast = calculateContrastRatio(bgColor, newHex);

        if (newContrast >= targetContrast) {
            return newHex;
        }
    }

    // If we couldn't find a suitable contrast, try a more extreme approach
    return shouldLighten ? '#FFFFFF' : '#000000';
}
