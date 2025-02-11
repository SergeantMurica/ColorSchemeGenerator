import React, {useEffect, useState} from 'react';
import ModeSelector from '../components/ModeSelector';
import RoleManager from '../components/RoleManager';
import ColorSchemeDisplay from '../components/ColorSchemeDisplay';
import StyleExamples from '../components/StyleExamples';
import CopySection from '../components/CopySection';
import {
    adjustColorForRole,
    generateColorblindColor,
    generateColorScheme,
    generateDarkColor,
    generateHighContrastColor,
    hexToHSL,
    hslToHex,
    RoleType,
    SchemeType,
} from '../utils/colorUtils';
import {sanitizeName} from '../utils/helpers';
import {Role, RoleResult, VariantSet} from '../utils/types';
import {Grid2} from "@mui/material";
import ColorPicker from "../components/ColorPicker.tsx";


const ColorSchemeGenerator: React.FC = () => {
    // Default roles (one per type)
    const defaultRoles: Role[] = [
        {id: 1, name: 'Background', type: 'Background'},
        {id: 2, name: 'Text', type: 'Text'},
        {id: 3, name: 'Border', type: 'Border'},
        {id: 4, name: 'Highlight', type: 'Highlight'},
        {id: 5, name: 'Accent', type: 'Accent'},
        {id: 6, name: 'CTA', type: 'CTA'},
        {id: 7, name: 'Link', type: 'Link'},
        {id: 8, name: 'Success', type: 'Success'},
        {id: 9, name: 'Warning', type: 'Warning'},
        {id: 10, name: 'Error', type: 'Error'},
        {id: 11, name: 'Info', type: 'Info'},
        {id: 12, name: 'Disabled', type: 'Disabled'},
        {id: 13, name: 'Secondary', type: 'Secondary'},
        {id: 14, name: 'Overlay', type: 'Overlay'},
    ];

    const [baseColor, setBaseColor] = useState('#3498db');
    const [scheme, setScheme] = useState<SchemeType>('monochromatic');
    const [roles, setRoles] = useState<Role[]>(defaultRoles);
    const [resultRoles, setResultRoles] = useState<RoleResult[]>([]);
    const [roleVariants, setRoleVariants] = useState<Record<number, VariantSet>>({});
    const [darkMode, setDarkMode] = useState(false);
    const [highContrast, setHighContrast] = useState(false);
    const [colorblindMode, setColorblindMode] = useState("none");
    const [previewDarkHighContrast, setPreviewDarkHighContrast] = useState(false);
    const [previewDarkColorblind, setPreviewDarkColorblind] = useState(false);
    const [showOverlayExample, setShowOverlayExample] = useState(false);

    // Copy section state
    const [copyText, setCopyText] = useState("");
    const [selectedVariants, setSelectedVariants] = useState<string[]>([
        "base",
    ]);
    const [outputFormat, setOutputFormat] = useState<"css" | "list">("css");

    // Update document classes based on mode toggles
    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [darkMode]);
    useEffect(() => {
        if (highContrast) {
            document.documentElement.classList.add('high-contrast');
        } else {
            document.documentElement.classList.remove('high-contrast');
        }
    }, [highContrast]);
    useEffect(() => {
        if (colorblindMode !== "none") {
            document.documentElement.classList.add('colorblind');
        } else {
            document.documentElement.classList.remove('colorblind');
        }
    }, [colorblindMode]);

    // Helper to update CSS variables for one role (using its sanitized name)
    const setRoleCssVariables = (role: Role, adjustedColor: string) => {
        const varBase = `--color-${sanitizeName(role.name)}`;
        document.documentElement.style.setProperty(varBase, adjustedColor);
        const darkVariant = generateDarkColor(adjustedColor);
        document.documentElement.style.setProperty(`${varBase}-dark`, darkVariant);
        const hcVariant = generateHighContrastColor(adjustedColor);
        document.documentElement.style.setProperty(`${varBase}-hc`, hcVariant);
        const darkHcVariant = generateDarkColor(hcVariant);
        document.documentElement.style.setProperty(`${varBase}-dark-hc`, darkHcVariant);
        const cbProtanopia = generateColorblindColor(adjustedColor, "protanopia");
        document.documentElement.style.setProperty(`${varBase}-cb-protanopia`, cbProtanopia);
        const cbDeuteranopia = generateColorblindColor(adjustedColor, "deuteranopia");
        document.documentElement.style.setProperty(`${varBase}-cb-deuteranopia`, cbDeuteranopia);
        const cbTritanopia = generateColorblindColor(adjustedColor, "tritanopia");
        document.documentElement.style.setProperty(`${varBase}-cb-tritanopia`, cbTritanopia);
        const cbAchromatopsia = generateColorblindColor(adjustedColor, "achromatopsia");
        document.documentElement.style.setProperty(`${varBase}-cb-achromatopsia`, cbAchromatopsia);
        document.documentElement.style.setProperty(`${varBase}-dark-cb-protanopia`, generateDarkColor(cbProtanopia));
        document.documentElement.style.setProperty(`${varBase}-dark-cb-deuteranopia`, generateDarkColor(cbDeuteranopia));
        document.documentElement.style.setProperty(`${varBase}-dark-cb-tritanopia`, generateDarkColor(cbTritanopia));
        document.documentElement.style.setProperty(`${varBase}-dark-cb-achromatopsia`, generateDarkColor(cbAchromatopsia));
    };

    // When generating, we want to vary colors for duplicate types.
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (roles.length === 0) return;
        const baseColors = generateColorScheme(baseColor, scheme, roles.length);
        const newResultRoles: RoleResult[] = [];
        const newRoleVariants: Record<number, VariantSet> = {};
        const typeCounts: Record<string, number> = {};

        roles.forEach((role, index) => {
            const count = typeCounts[role.type] || 0;
            typeCounts[role.type] = count + 1;
            // Compute a color for this role using the adjustment function,
            // so that duplicate roles get slightly different shades.
            let adjustedColor = adjustColorForRole(baseColors[index], role.type, count);

            if (role.type === "Overlay") {
                // For overlay, ignore the usual adjustments and force a low opacity value.
                // Use a dark overlay for dark mode and a light overlay for light mode.
                adjustedColor = darkMode
                    ? "rgba(255, 255, 255, 0.2)"
                    : "rgba(0, 0, 0, 0.3)";

                // Also set the variant set for overlay to use this same value.
                newRoleVariants[role.id] = {
                    base: adjustedColor,
                    dark: adjustedColor,
                    highContrast: adjustedColor,
                    darkHighContrast: adjustedColor,
                    colorblind: {
                        protanopia: adjustedColor,
                        deuteranopia: adjustedColor,
                        tritanopia: adjustedColor,
                        achromatopsia: adjustedColor,
                    },
                    darkColorblind: {
                        protanopia: adjustedColor,
                        deuteranopia: adjustedColor,
                        tritanopia: adjustedColor,
                        achromatopsia: adjustedColor,
                    },
                };
            } else {
                // For non-overlay roles, process normally.
                // (For example, you might vary lightness for duplicate roles.)
                // Example: For Background roles, adjust lightness with an array of values.
                if (role.type === "Background" && count < 3) {
                    const lightnessValues = darkMode ? [10, 20, 30] : [98, 88, 78];
                    const hsl = hexToHSL(adjustedColor);
                    hsl.l = lightnessValues[count];
                    adjustedColor = hslToHex(hsl);
                }
                newRoleVariants[role.id] = {
                    base: adjustedColor,
                    dark: generateDarkColor(adjustedColor),
                    highContrast: generateHighContrastColor(adjustedColor),
                    darkHighContrast: generateDarkColor(generateHighContrastColor(adjustedColor)),
                    colorblind: {
                        protanopia: generateColorblindColor(adjustedColor, "protanopia"),
                        deuteranopia: generateColorblindColor(adjustedColor, "deuteranopia"),
                        tritanopia: generateColorblindColor(adjustedColor, "tritanopia"),
                        achromatopsia: generateColorblindColor(adjustedColor, "achromatopsia"),
                    },
                    darkColorblind: {
                        protanopia: generateDarkColor(generateColorblindColor(adjustedColor, "protanopia")),
                        deuteranopia: generateDarkColor(generateColorblindColor(adjustedColor, "deuteranopia")),
                        tritanopia: generateDarkColor(generateColorblindColor(adjustedColor, "tritanopia")),
                        achromatopsia: generateDarkColor(generateColorblindColor(adjustedColor, "achromatopsia")),
                    },
                };
            }

            newResultRoles.push({role, color: adjustedColor});
            // Set CSS variables based on the role's name.
            setRoleCssVariables(role, adjustedColor);
        });

        setResultRoles(newResultRoles);
        setRoleVariants(newRoleVariants);


    };


    const addRole = () => {
        if (roles.length >= 20) return;
        const newRole: Role = {
            id: Date.now(),
            name: `Role ${roles.length + 1}`,
            type: 'Background',
        };
        setRoles([...roles, newRole]);
    };

    const updateRole = (id: number, field: string | number | symbol, value: string | RoleType) => {
        setRoles(roles.map(role => (role.id === id ? {...role, [field]: value} : role)));
    };

    const removeRole = (id: number) => {
        setRoles(roles.filter(role => role.id !== id));
    };


    return (
        <Grid2 container spacing={4} className="p-4">
            <Grid2 size={{sm: 12, md: 6}}>
                <Grid2 container spacing={4} className="p-4" component="div">
                    <Grid2 size={12} component="div">
                        <h1 className="text-3xl font-bold mb-4">Color Scheme Generator</h1>
                    </Grid2>
                    <Grid2 size={12}>
                        <form onSubmit={handleSubmit} className="mb-8 space-y-4">
                            <div>
                                <label className="block mb-1">Base Color (Hex):</label>
                                <ColorPicker value={baseColor} onChange={setBaseColor}/>
                            </div>
                            <div>
                                <label htmlFor="scheme" className="block mb-1">
                                    Scheme Type:
                                </label>
                                <select
                                    id="scheme"
                                    value={scheme}
                                    onChange={(e) => setScheme(e.target.value as SchemeType)}
                                    className="border border-[var(--color-border)] p-2 rounded w-full"
                                >
                                    <option value="monochromatic">Monochromatic</option>
                                    <option value="analogous">Analogous</option>
                                    <option value="complementary">Complementary</option>
                                    <option value="splitComplementary">Split Complementary</option>
                                    <option value="triadic">Triadic</option>
                                    <option value="tetradic">Tetradic</option>
                                </select>
                            </div>
                            <ModeSelector
                                darkMode={darkMode}
                                setDarkMode={setDarkMode}
                                highContrast={highContrast}
                                setHighContrast={setHighContrast}
                                colorblindMode={colorblindMode}
                                setColorblindMode={setColorblindMode}
                                previewDarkHighContrast={previewDarkHighContrast}
                                setPreviewDarkHighContrast={setPreviewDarkHighContrast}
                                previewDarkColorblind={previewDarkColorblind}
                                setPreviewDarkColorblind={setPreviewDarkColorblind}
                            />
                            <button type="submit" className="button-cta">
                                Generate Color Scheme
                            </button>
                            <RoleManager
                                roles={roles}
                                updateRole={updateRole}
                                removeRole={removeRole}
                                addRole={addRole}
                            />
                        </form>
                    </Grid2>
                </Grid2>
            </Grid2>
            <Grid2 size={{sm: 12, md: 6}}>
                <Grid2 container spacing={4} className="p-4" component="div">
                    <Grid2 size={12}>
                        <ColorSchemeDisplay resultRoles={resultRoles}/>
                    </Grid2>
                    <Grid2 size={12}>
                        <StyleExamples
                            resultRoles={resultRoles}
                            roleVariants={roleVariants}
                            darkMode={darkMode}
                            highContrast={highContrast}
                            colorblindMode={colorblindMode}
                            previewDarkHighContrast={previewDarkHighContrast}
                            previewDarkColorblind={previewDarkColorblind}
                            showOverlayExample={showOverlayExample}
                            setShowOverlayExample={setShowOverlayExample}
                        />
                    </Grid2>
                    <Grid2 size={12}>
                        <CopySection
                            resultRoles={resultRoles}
                            roleVariants={roleVariants}
                            selectedRoleIds={resultRoles.map((r) => r.role.id)}
                            selectedVariants={selectedVariants}
                            setSelectedVariants={setSelectedVariants}
                            outputFormat={outputFormat}
                            setOutputFormat={setOutputFormat}
                            copyText={copyText}
                            setCopyText={setCopyText}
                        />
                    </Grid2>
                </Grid2>
            </Grid2>
        </Grid2>
    );
};

export default ColorSchemeGenerator;
