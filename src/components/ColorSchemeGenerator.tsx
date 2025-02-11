// src/components/Generators.tsx
import React, {JSX, useEffect, useState} from 'react';
import {adjustColorForRole, generateColorScheme, generateDarkColor, RoleType, SchemeType,} from '../utils/colorUtils';

interface Role {
    id: number;
    name: string;
    type: RoleType;
}

interface RoleResult {
    role: Role;
    color: string;
}

const Generators: React.FC = () => {
    // Default starting roles for every role type.
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
    const [darkMode, setDarkMode] = useState(false);
    const [showOverlayExample, setShowOverlayExample] = useState(false);

    // Toggle dark mode class on the document root.
    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [darkMode]);

    const addRole = () => {
        if (roles.length >= 15) return;
        const newRole: Role = {
            id: Date.now(),
            name: `Role ${roles.length + 1}`,
            type: 'Background',
        };
        setRoles([...roles, newRole]);
    };

    const updateRole = (id: number, field: keyof Role, value: Role[keyof Role]) => {
        setRoles(roles.map(role => (role.id === id ? {...role, [field]: value} : role)));
    };

    const removeRole = (id: number) => {
        setRoles(roles.filter(role => role.id !== id));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (roles.length === 0) return;

        // Generate a color for each role.
        const baseColors = generateColorScheme(baseColor, scheme, roles.length);
        const typeCounts: { [key in RoleType]?: number } = {};

        const results: RoleResult[] = roles.map((role, index) => {
            const countForType = typeCounts[role.type] || 0;
            typeCounts[role.type] = countForType + 1;
            const adjustedColor = adjustColorForRole(baseColors[index], role.type, countForType);

            // Always set both light and dark variants for the first instance.
            if (countForType === 0) {
                document.documentElement.style.setProperty(`--color-${role.type.toLowerCase()}`, adjustedColor);
                const darkVariant = generateDarkColor(adjustedColor);
                document.documentElement.style.setProperty(`--color-${role.type.toLowerCase()}-dark`, darkVariant);
            }
            return {role, color: adjustedColor};
        });

        setResultRoles(results);
    };

    // Examples for every role type.
    const roleExamples: { type: RoleType; example: JSX.Element }[] = [
        {type: 'Background', example: <div className="container">Background Example</div>},
        {type: 'Text', example: <p className="text-[var(--color-text)]">Text color example.</p>},
        {type: 'Border', example: <div className="container">Border Example (container)</div>},
        {type: 'Highlight', example: <div className="highlight p-4">Highlight Example</div>},
        {type: 'Accent', example: <p className="accent">Accent Text Example</p>},
        {type: 'CTA', example: <button className="button-cta">CTA Button</button>},
        {type: 'Link', example: <a href="#" className="text-[var(--color-link)]">Example Link</a>},
        {type: 'Success', example: <div className="alert-success">Success Alert Example</div>},
        {type: 'Warning', example: <div className="alert-warning">Warning Alert Example</div>},
        {type: 'Error', example: <div className="alert-error">Error Alert Example</div>},
        {type: 'Info', example: <div className="alert-info">Info Alert Example</div>},
        {type: 'Disabled', example: <button className="disabled" disabled>Disabled Button</button>},
        {type: 'Secondary', example: <p className="text-[var(--color-secondary)]">Secondary Text Example</p>},
        {
            type: 'Overlay',
            example: (
                <>
                    {showOverlayExample ? (
                        <div className="overlay">
                            <div className="bg-white p-4 rounded relative">
                                <button
                                    onClick={() => setShowOverlayExample(false)}
                                    className="absolute top-2 right-2 bg-[var(--color-error)] text-[var(--color-background)] p-1 rounded">
                                    Close
                                </button>
                                Overlay Content Example
                            </div>
                        </div>
                    ) : (
                        <button
                            onClick={() => setShowOverlayExample(true)}
                            className="bg-[var(--color-accent)] text-[var(--color-background)] p-2 rounded">
                            Open Overlay Example
                        </button>
                    )}
                </>
            ),
        },
    ];

    return (
        <div className="p-4">
            <h1 className="text-3xl font-bold mb-4">Color Scheme Generator</h1>
            <form onSubmit={handleSubmit} className="mb-8 space-y-4">
                <div>
                    <label htmlFor="baseColor" className="block mb-1">Base Color (Hex):</label>
                    <input
                        id="baseColor"
                        type="text"
                        value={baseColor}
                        onChange={e => setBaseColor(e.target.value)}
                        placeholder="#3498db"
                        className="border border-[var(--color-border)] p-2 rounded w-full"
                    />
                </div>
                <div>
                    <label htmlFor="scheme" className="block mb-1">Scheme Type:</label>
                    <select
                        id="scheme"
                        value={scheme}
                        onChange={e => setScheme(e.target.value as SchemeType)}
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
                <div>
                    <label className="inline-flex items-center">
                        <input
                            type="checkbox"
                            checked={darkMode}
                            onChange={e => setDarkMode(e.target.checked)}
                            className="mr-2"
                        />
                        Dark Mode
                    </label>
                </div>
                <div>
                    <h3 className="text-xl font-semibold mb-2">Roles (up to 15)</h3>
                    {roles.map(role => (
                        <div key={role.id} className="border border-[var(--color-border)] p-4 mb-4 rounded">
                            <div className="mb-2">
                                <label className="block mb-1">Name:</label>
                                <input
                                    type="text"
                                    value={role.name}
                                    onChange={e => updateRole(role.id, 'name', e.target.value)}
                                    className="border border-[var(--color-border)] p-2 rounded w-full"
                                />
                            </div>
                            <div className="mb-2">
                                <label className="block mb-1">Type:</label>
                                <select
                                    value={role.type}
                                    onChange={e => updateRole(role.id, 'type', e.target.value as RoleType)}
                                    className="border border-[var(--color-border)] p-2 rounded w-full"
                                >
                                    <option value="Background">Background</option>
                                    <option value="Text">Text</option>
                                    <option value="Border">Border</option>
                                    <option value="Highlight">Highlight</option>
                                    <option value="Accent">Accent</option>
                                    <option value="CTA">CTA</option>
                                    <option value="Link">Link</option>
                                    <option value="Success">Success</option>
                                    <option value="Warning">Warning</option>
                                    <option value="Error">Error</option>
                                    <option value="Info">Info</option>
                                    <option value="Disabled">Disabled</option>
                                    <option value="Secondary">Secondary</option>
                                    <option value="Overlay">Overlay</option>
                                </select>
                            </div>
                            <button
                                type="button"
                                onClick={() => removeRole(role.id)}
                                className="mt-2 bg-[var(--color-error)] text-[var(--color-background)] p-2 rounded"
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={addRole}
                        disabled={roles.length >= 15}
                        className="bg-[var(--color-accent)] text-[var(--color-background)] p-2 rounded"
                    >
                        Add Role
                    </button>
                </div>
                <button type="submit" className="button-cta">
                    Generate Color Scheme
                </button>
            </form>

            {resultRoles.length > 0 && (
                <div className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">Generated Color Scheme:</h2>
                    <ul>
                        {resultRoles.map(({role, color}) => (
                            <li key={role.id} className="flex items-center mb-4">
                                <div
                                    className="w-12 h-12 mr-4 rounded border border-[var(--color-border)]"
                                    style={{backgroundColor: color}}
                                ></div>
                                <span>
                  {role.name} ({role.type}): {color}
                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Style Examples</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {roleExamples.map(example => (
                        <div key={example.type} className="p-4 border border-[var(--color-border)] rounded">
                            <h3 className="font-bold mb-2">{example.type}</h3>
                            {example.example}
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Generators;
