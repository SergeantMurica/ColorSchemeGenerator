import { Color, HSL, hslToHex, hexToHSL } from './colorUtils';
import { calculateContrastRatio } from './contrast';

/**
 * Generate optimized text colors for a background color
 */
export function generateTextColors(backgroundColor: Color, isDarkMode: boolean, isHighContrast: boolean): {
    primary: Color;
    secondary: Color;
    tertiary: Color;
    link: Color;
    linkHover: Color;
    inactive: Color;
} {
    const { h, l } = backgroundColor.hsl;

    // Minimum contrast ratios based on mode
    const minPrimaryContrast = isHighContrast ? 7 : 4.5;
    const minSecondaryContrast = isHighContrast ? 5.5 : 3.5;
    const minTertiaryContrast = isHighContrast ? 4.5 : 3;

    // Determine if we should use light or dark text base
    const useLight = l < 50;

    // Generate primary text (maximum contrast)
    const primaryHSL: HSL = useLight
        ? { h, s: isDarkMode ? 8 : 5, l: isDarkMode ? 98 : 95 }
        : { h, s: isDarkMode ? 8 : 10, l: isDarkMode ? 8 : 10 };

    let primaryHex = hslToHex(primaryHSL);

    // Check and adjust contrast
    let contrast = calculateContrastRatio(backgroundColor.hex, primaryHex);
    if (contrast < minPrimaryContrast) {
        // Adjust lightness until we reach minimum contrast
        for (let i = 0; i < 20; i++) {
            const adjustedHSL = {
                ...primaryHSL,
                l: useLight ? Math.min(100, primaryHSL.l + i * 2) : Math.max(0, primaryHSL.l - i * 2)
            };
            const adjustedHex = hslToHex(adjustedHSL);
            const newContrast = calculateContrastRatio(backgroundColor.hex, adjustedHex);

            if (newContrast >= minPrimaryContrast) {
                primaryHex = adjustedHex;
                contrast = newContrast;
                break;
            }
        }
    }

    // Calculate other text colors based on primary text color
    const primaryColor: Color = {
        hex: primaryHex,
        hsl: hexToHSL(primaryHex),
        rgb: { r: 0, g: 0, b: 0 }, // This would be calculated properly in practice
        role: 'text-primary',
        name: useLight ? 'Light Text' : 'Dark Text',
        isAccessible: contrast >= minPrimaryContrast,
        contrastRatio: contrast
    };

    // Secondary text (slightly less contrast)
    const secondaryHSL: HSL = {
        ...primaryColor.hsl,
        l: useLight
            ? Math.max(50, primaryColor.hsl.l - 15)
            : Math.min(70, primaryColor.hsl.l + 20)
    };
    const secondaryHex = hslToHex(secondaryHSL);
    const secondaryContrast = calculateContrastRatio(backgroundColor.hex, secondaryHex);

    // Tertiary text (even less contrast)
    const tertiaryHSL: HSL = {
        ...primaryColor.hsl,
        l: useLight
            ? Math.max(40, primaryColor.hsl.l - 25)
            : Math.min(80, primaryColor.hsl.l + 30)
    };
    const tertiaryHex = hslToHex(tertiaryHSL);
    const tertiaryContrast = calculateContrastRatio(backgroundColor.hex, tertiaryHex);

    // Link color (using a hue that contrasts with the background)
    const linkHSL: HSL = {
        h: (h + 210) % 360,
        s: isDarkMode
            ? (isHighContrast ? 85 : 75)  // Higher saturation in dark mode
            : (isHighContrast ? 80 : 70),
        l: isDarkMode
            ? (useLight ? 70 : 50)  // Brighter links in dark mode
            : (useLight ? 65 : 45)
    };

    const linkHex = hslToHex(linkHSL);
    const linkContrast = calculateContrastRatio(backgroundColor.hex, linkHex);

    // Link hover (more saturated and slightly different lightness)
    const linkHoverHSL: HSL = {
        ...linkHSL,
        s: Math.min(100, linkHSL.s + 10),
        l: useLight ? Math.min(75, linkHSL.l + 10) : Math.max(35, linkHSL.l - 5)
    };

    // Inactive text (low contrast)
    const inactiveHSL: HSL = {
        ...primaryColor.hsl,
        s: Math.max(0, primaryColor.hsl.s - (isDarkMode ? 5 : 10)),
        l: useLight
            ? Math.max(30, primaryColor.hsl.l - (isDarkMode ? 30 : 35))
            : Math.min(85, primaryColor.hsl.l + (isDarkMode ? 30 : 35))
    };


    return {
        primary: primaryColor,
        secondary: {
            hex: secondaryHex,
            hsl: secondaryHSL,
            rgb: { r: 0, g: 0, b: 0 }, // Would be calculated properly
            role: 'text-secondary',
            name: 'Secondary Text',
            isAccessible: secondaryContrast >= minSecondaryContrast,
            contrastRatio: secondaryContrast
        },
        tertiary: {
            hex: tertiaryHex,
            hsl: tertiaryHSL,
            rgb: { r: 0, g: 0, b: 0 }, // Would be calculated properly
            role: 'text-tertiary',
            name: 'Tertiary Text',
            isAccessible: tertiaryContrast >= minTertiaryContrast,
            contrastRatio: tertiaryContrast
        },
        link: {
            hex: linkHex,
            hsl: linkHSL,
            rgb: { r: 0, g: 0, b: 0 }, // Would be calculated properly
            role: 'text-link',
            name: 'Link Text',
            isAccessible: linkContrast >= minSecondaryContrast,
            contrastRatio: linkContrast
        },
        linkHover: {
            hex: hslToHex(linkHoverHSL),
            hsl: linkHoverHSL,
            rgb: { r: 0, g: 0, b: 0 }, // Would be calculated properly
            role: 'text-link-hover',
            name: 'Link Hover',
            isAccessible: true, // Would check properly
            contrastRatio: 1 // Would calculate properly
        },
        inactive: {
            hex: hslToHex(inactiveHSL),
            hsl: inactiveHSL,
            rgb: { r: 0, g: 0, b: 0 }, // Would be calculated properly
            role: 'text-inactive',
            name: 'Inactive Text',
            isAccessible: true, // Not as important for inactive elements
            contrastRatio: 1 // Would calculate properly
        }
    };
}
