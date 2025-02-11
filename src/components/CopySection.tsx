import React from 'react';
import {RoleResult} from '../utils/types.ts';
import {sanitizeName} from '../utils/helpers';

interface VariantSet {
    base: string;
    dark: string;
    highContrast: string;
    darkHighContrast: string;
    colorblind: {
        protanopia: string;
        deuteranopia: string;
        tritanopia: string;
        achromatopsia: string;
    };
    darkColorblind: {
        protanopia: string;
        deuteranopia: string;
        tritanopia: string;
        achromatopsia: string;
    };
}

interface CopySectionProps {
    resultRoles: RoleResult[];
    roleVariants: Record<number, VariantSet>;
    selectedRoleIds: number[];
    selectedVariants: string[];
    setSelectedVariants: (v: string[]) => void;
    outputFormat: "css" | "list";
    setOutputFormat: (v: "css" | "list") => void;
    copyText: string;
    setCopyText: (text: string) => void;
}

const CopySection: React.FC<CopySectionProps> = ({
                                                     resultRoles,
                                                     roleVariants,
                                                     selectedRoleIds,
                                                     selectedVariants,
                                                     setSelectedVariants,
                                                     outputFormat,
                                                     setOutputFormat,
                                                     copyText,
                                                     setCopyText,
                                                 }) => {
    const variantOptions = [
        {value: "base", label: "Base"},
        {value: "dark", label: "Dark"},
        {value: "highContrast", label: "High Contrast"},
        {value: "darkHighContrast", label: "Dark High Contrast"},
        {value: "colorblind_protanopia", label: "Colorblind (Protanopia)"},
        {value: "colorblind_deuteranopia", label: "Colorblind (Deuteranopia)"},
        {value: "colorblind_tritanopia", label: "Colorblind (Tritanopia)"},
        {value: "colorblind_achromatopsia", label: "Colorblind (Achromatopsia)"},
        {value: "darkColorblind_protanopia", label: "Dark Colorblind (Protanopia)"},
        {value: "darkColorblind_deuteranopia", label: "Dark Colorblind (Deuteranopia)"},
        {value: "darkColorblind_tritanopia", label: "Dark Colorblind (Tritanopia)"},
        {value: "darkColorblind_achromatopsia", label: "Dark Colorblind (Achromatopsia)"},
    ];

    const toggleVariant = (variant: string) => {
        if (selectedVariants.includes(variant)) {
            setSelectedVariants(selectedVariants.filter((v) => v !== variant));
        } else {
            setSelectedVariants([...selectedVariants, variant]);
        }
    };

    const generateCopyText = () => {
        const lines: string[] = [];
        resultRoles.forEach(({role}) => {
            if (selectedRoleIds.includes(role.id)) {
                const variants = roleVariants[role.id];
                const varBase = `--color-${sanitizeName(role.name)}`;
                selectedVariants.forEach((variantKey) => {
                    let varName = "";
                    let value = "";
                    switch (variantKey) {
                        case "base":
                            varName = varBase;
                            value = variants.base;
                            break;
                        case "dark":
                            varName = `${varBase}-dark`;
                            value = variants.dark;
                            break;
                        case "highContrast":
                            varName = `${varBase}-hc`;
                            value = variants.highContrast;
                            break;
                        case "darkHighContrast":
                            varName = `${varBase}-dark-hc`;
                            value = variants.darkHighContrast;
                            break;
                        case "colorblind_protanopia":
                            varName = `${varBase}-cb-protanopia`;
                            value = variants.colorblind.protanopia;
                            break;
                        case "colorblind_deuteranopia":
                            varName = `${varBase}-cb-deuteranopia`;
                            value = variants.colorblind.deuteranopia;
                            break;
                        case "colorblind_tritanopia":
                            varName = `${varBase}-cb-tritanopia`;
                            value = variants.colorblind.tritanopia;
                            break;
                        case "colorblind_achromatopsia":
                            varName = `${varBase}-cb-achromatopsia`;
                            value = variants.colorblind.achromatopsia;
                            break;
                        case "darkColorblind_protanopia":
                            varName = `${varBase}-dark-cb-protanopia`;
                            value = variants.darkColorblind.protanopia;
                            break;
                        case "darkColorblind_deuteranopia":
                            varName = `${varBase}-dark-cb-deuteranopia`;
                            value = variants.darkColorblind.deuteranopia;
                            break;
                        case "darkColorblind_tritanopia":
                            varName = `${varBase}-dark-cb-tritanopia`;
                            value = variants.darkColorblind.tritanopia;
                            break;
                        case "darkColorblind_achromatopsia":
                            varName = `${varBase}-dark-cb-achromatopsia`;
                            value = variants.darkColorblind.achromatopsia;
                            break;
                        default:
                            break;
                    }
                    if (outputFormat === "css") {
                        lines.push(`${varName}: ${value};`);
                    } else {
                        let label = "";
                        if (variantKey === "base") label = "Base";
                        else if (variantKey === "dark") label = "Dark";
                        else if (variantKey === "highContrast") label = "High Contrast";
                        else if (variantKey === "darkHighContrast") label = "Dark High Contrast";
                        else if (variantKey.startsWith("colorblind_")) {
                            label = "Colorblind (" + variantKey.split("_")[1].charAt(0).toUpperCase() + variantKey.split("_")[1].slice(1) + ")";
                        } else if (variantKey.startsWith("darkColorblind_")) {
                            label = "Dark Colorblind (" + variantKey.split("_")[1].charAt(0).toUpperCase() + variantKey.split("_")[1].slice(1) + ")";
                        }
                        lines.push(`${role.name} (${label}): ${value}`);
                    }
                });
            }
        });
        setCopyText(lines.join("\n"));
    };

    const handleCopyToClipboard = () => {
        navigator.clipboard.writeText(copyText);
        alert("Copied to clipboard!");
    };

    return (
        <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Copy Colors</h2>
            <div className="mb-4">
                <h3 className="font-semibold">Select Variants:</h3>
                {variantOptions.map((v) => (
                    <label key={v.value} className="inline-flex items-center mr-4">
                        <input
                            type="checkbox"
                            value={v.value}
                            checked={selectedVariants.includes(v.value)}
                            onChange={() => toggleVariant(v.value)}
                            className="mr-1"
                        />
                        {v.label}
                    </label>
                ))}
            </div>
            <div className="mb-4">
                <h3 className="font-semibold">Output Format:</h3>
                <label className="inline-flex items-center mr-4">
                    <input
                        type="radio"
                        name="outputFormat"
                        value="css"
                        checked={outputFormat === "css"}
                        onChange={() => setOutputFormat("css")}
                        className="mr-1"
                    />
                    CSS Variables
                </label>
                <label className="inline-flex items-center">
                    <input
                        type="radio"
                        name="outputFormat"
                        value="list"
                        checked={outputFormat === "list"}
                        onChange={() => setOutputFormat("list")}
                        className="mr-1"
                    />
                    List with Names
                </label>
            </div>
            <button onClick={generateCopyText} className="button-cta mb-4">
                Generate Copy Text
            </button>
            <textarea
                readOnly
                value={copyText}
                className="w-full p-2 border rounded mb-2"
                rows={8}
            ></textarea>
            <button onClick={handleCopyToClipboard} className="button-cta">
                Copy to Clipboard
            </button>
        </section>
    );
};

export default CopySection;
