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

interface StyleExamplesProps {
    resultRoles: RoleResult[];
    roleVariants: Record<number, VariantSet>;
    darkMode: boolean;
    highContrast: boolean;
    colorblindMode: string;
    previewDarkHighContrast: boolean;
    previewDarkColorblind: boolean;
    showOverlayExample: boolean;
    setShowOverlayExample: (value: boolean) => void;
}

const getActiveVariantForRole = (
    variants: VariantSet,
    darkMode: boolean,
    highContrast: boolean,
    previewDarkHighContrast: boolean,
    colorblindMode: string,
    previewDarkColorblind: boolean
): string => {
    if (colorblindMode !== "none") {
        return previewDarkColorblind
            ? variants.darkColorblind[colorblindMode as keyof typeof variants.darkColorblind]
            : variants.colorblind[colorblindMode as keyof typeof variants.colorblind];
    } else if (highContrast) {
        return previewDarkHighContrast ? variants.darkHighContrast : variants.highContrast;
    } else {
        return darkMode ? variants.dark : variants.base;
    }
};

const StyleExamples: React.FC<StyleExamplesProps> = ({
                                                         resultRoles,
                                                         roleVariants,
                                                         darkMode,
                                                         highContrast,
                                                         colorblindMode,
                                                         previewDarkHighContrast,
                                                         previewDarkColorblind,
                                                         showOverlayExample,
                                                         setShowOverlayExample,
                                                     }) => {
    return (
        <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Style Examples</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {resultRoles.map(({role}) => {
                    const variants = roleVariants[role.id];
                    if (!variants) return null;
                    const activeColor = getActiveVariantForRole(
                        variants,
                        darkMode,
                        highContrast,
                        previewDarkHighContrast,
                        colorblindMode,
                        previewDarkColorblind
                    );
                    const varName = `--color-${sanitizeName(role.name)}`;
                    return (
                        <div key={role.id} className="p-4 border border-[var(--color-border)] rounded">
                            <h3 className="font-bold mb-2">
                                {role.name} ({role.type})
                            </h3>
                            <div className="flex items-center">
                                <div
                                    className="w-12 h-12 mr-4 rounded border"
                                    style={{backgroundColor: activeColor, borderColor: activeColor}}
                                ></div>
                                <span>
                  {varName}: {activeColor}
                </span>
                            </div>
                        </div>
                    );
                })}
                <div className="p-4 border border-[var(--color-border)] rounded">
                    <h3 className="font-bold mb-2">Overlay</h3>
                    {showOverlayExample ? (
                        <div className="overlay">
                            <div className="bg-white p-4 rounded relative">
                                <button
                                    onClick={() => setShowOverlayExample(false)}
                                    className="absolute top-2 right-2 bg-[var(--color-error)] text-[var(--color-background)] p-1 rounded"
                                >
                                    Close
                                </button>
                                Overlay Content Example
                            </div>
                        </div>
                    ) : (
                        <button
                            onClick={() => setShowOverlayExample(true)}
                            className="bg-[var(--color-accent)] text-[var(--color-background)] p-2 rounded"
                        >
                            Open Overlay Example
                        </button>
                    )}
                </div>
            </div>
        </section>
    );
};

export default StyleExamples;
