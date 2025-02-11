import React, {useEffect, useState} from 'react';
import {hexToHSL, hslToHex} from '../utils/colorUtils';

interface ColorPickerProps {
    value: string; // 6-digit hex string (e.g. "#3498db")
    onChange: (newColor: string) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({value, onChange}) => {
    // Internal state: base (hex), hue offset, opacity percentage.
    const [base, setBase] = useState(value || "#3498db");
    const [hueOffset, setHueOffset] = useState(0);

    // When any input changes, recompute the displayed color.
    useEffect(() => {
        // Convert the base color to HSL, add hue offset (wrapping at 360).
        const hsl = hexToHSL(base);
        hsl.h = (hsl.h + hueOffset + 360) % 360;
        // Convert back to hex (ignore opacity for the computed color because our generation functions expect 6-digit hex)
        const newHex = hslToHex(hsl);
        onChange(newHex);
    }, [base, hueOffset, onChange]);

    // Allow manual hex input – simple validation for a 6-digit hex code.
    const handleManualInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
            setBase(val);
        }
    };

    return (
        <div className="p-4 border rounded mb-4">
            <h3 className="font-bold mb-2">Select Base Color</h3>
            <div className="flex items-center mb-2">
                <input
                    type="color"
                    value={base}
                    onChange={(e) => setBase(e.target.value)}
                    className="mr-4"
                />
                <input
                    type="text"
                    value={base}
                    onChange={handleManualInput}
                    className="border p-1 rounded w-32"
                />
            </div>
            <div className="mb-2">
                <label className="block">Hue Offset: {hueOffset}°</label>
                <input
                    type="range"
                    min="-180"
                    max="180"
                    value={hueOffset}
                    onChange={(e) => setHueOffset(parseInt(e.target.value))}
                    className="w-full"
                />
            </div>
            <div className="mt-4">
                <span className="font-semibold mr-2">Preview:</span>
                <div
                    className="inline-block w-16 h-8 border rounded"
                    style={{backgroundColor: value}}
                ></div>
            </div>
        </div>
    );
};

export default ColorPicker;
