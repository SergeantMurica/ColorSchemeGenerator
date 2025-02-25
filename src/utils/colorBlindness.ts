interface RGB {
    r: number;
    g: number;
    b: number;
}

/**
 * Simulate various types of color blindness
 */
export function simulateColorBlindness(
    rgb: RGB,
    type: 'protanopia' | 'deuteranopia' | 'tritanopia' | 'achromatopsia' | 'none'
): RGB {
    // If no color blindness, return the original color
    if (type === 'none') {
        return rgb;
    }

    // Normalize RGB values to 0-1 range
    const r = rgb.r / 255;
    const g = rgb.g / 255;
    const b = rgb.b / 255;

    let simulated: [number, number, number];

    switch (type) {
        case 'protanopia': // Red-blind
            simulated = [
                0.567 * r + 0.433 * g,
                0.558 * r + 0.442 * g,
                0.242 * r + 0.758 * b
            ];
            break;

        case 'deuteranopia': // Green-blind
            simulated = [
                0.625 * r + 0.375 * g,
                0.7 * r + 0.3 * g,
                0.3 * r + 0.7 * b
            ];
            break;

        case 'tritanopia': // Blue-blind
            simulated = [
                0.95 * r + 0.05 * g,
                0.433 * r + 0.567 * g,
                0.475 * r + 0.525 * g
            ];
            break;

        case 'achromatopsia': // Total color blindness
            // Convert to grayscale using luminance formula
        {
            const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
            simulated = [luminance, luminance, luminance];
            break;
        }

        default:
            simulated = [r, g, b];
    }

    // Convert back to 0-255 range

    // Convert back to 0-255 range
    return {
        r: Math.round(Math.max(0, Math.min(255, simulated[0] * 255))),
        g: Math.round(Math.max(0, Math.min(255, simulated[1] * 255))),
        b: Math.round(Math.max(0, Math.min(255, simulated[2] * 255)))
    };
}
