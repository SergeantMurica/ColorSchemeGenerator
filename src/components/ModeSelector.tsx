import React from 'react';

interface ModeSelectorProps {
    darkMode: boolean;
    setDarkMode: (value: boolean) => void;
    highContrast: boolean;
    setHighContrast: (value: boolean) => void;
    colorblindMode: string;
    setColorblindMode: (value: string) => void;
    previewDarkHighContrast: boolean;
    setPreviewDarkHighContrast: (value: boolean) => void;
    previewDarkColorblind: boolean;
    setPreviewDarkColorblind: (value: boolean) => void;
}

const ModeSelector: React.FC<ModeSelectorProps> = ({
                                                       darkMode,
                                                       setDarkMode,
                                                       highContrast,
                                                       setHighContrast,
                                                       colorblindMode,
                                                       setColorblindMode,
                                                       previewDarkHighContrast,
                                                       setPreviewDarkHighContrast,
                                                       previewDarkColorblind,
                                                       setPreviewDarkColorblind,
                                                   }) => {
    return (
        <div className="space-y-2">
            <label className="inline-flex items-center">
                <input
                    type="checkbox"
                    checked={darkMode}
                    onChange={(e) => setDarkMode(e.target.checked)}
                    className="mr-2"
                />
                Dark Mode
            </label>
            <label className="inline-flex items-center">
                <input
                    type="checkbox"
                    checked={highContrast}
                    onChange={(e) => setHighContrast(e.target.checked)}
                    className="mr-2"
                />
                High Contrast Mode
            </label>
            {highContrast && (
                <label className="inline-flex items-center">
                    <input
                        type="checkbox"
                        checked={previewDarkHighContrast}
                        onChange={(e) => setPreviewDarkHighContrast(e.target.checked)}
                        className="mr-2"
                    />
                    Preview Dark High Contrast
                </label>
            )}
            <label className="block">
                Colorblind Mode:
                <select
                    value={colorblindMode}
                    onChange={(e) => setColorblindMode(e.target.value)}
                    className="border border-[var(--color-border)] p-2 rounded w-full mt-1"
                >
                    <option value="none">None</option>
                    <option value="protanopia">Protanopia</option>
                    <option value="deuteranopia">Deuteranopia</option>
                    <option value="tritanopia">Tritanopia</option>
                    <option value="achromatopsia">Achromatopsia</option>
                </select>
            </label>
            {colorblindMode !== "none" && (
                <label className="inline-flex items-center">
                    <input
                        type="checkbox"
                        checked={previewDarkColorblind}
                        onChange={(e) => setPreviewDarkColorblind(e.target.checked)}
                        className="mr-2"
                    />
                    Preview Dark Colorblind
                </label>
            )}
        </div>
    );
};

export default ModeSelector;
