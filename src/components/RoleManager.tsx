import React from 'react';
import {Role, RoleType} from '../utils/types.ts';
import {Grid2} from "@mui/material";

interface RoleManagerProps {
    roles: Role[];
    updateRole: (id: number, field: keyof Role, value: string | RoleType) => void;
    removeRole: (id: number) => void;
    addRole: () => void;
}

const RoleManager: React.FC<RoleManagerProps> = ({
                                                     roles,
                                                     updateRole,
                                                     removeRole,
                                                     addRole,
                                                 }) => {
    return (
        <Grid2 container spacing={4} className="p-4">
            <Grid2 size={12}>
                <h3 className="text-xl font-semibold mb-2">Colored Items (up to 20)</h3>
            </Grid2>
            <Grid2 size={12}>
                <button
                    type="button"
                    onClick={addRole}
                    disabled={roles.length >= 20}
                    className="bg-[var(--color-accent)] text-[var(--color-background)] p-2 rounded"
                >
                    Add Role
                </button>
            </Grid2>
            {roles.map((role) => (
                <Grid2 size={3} key={role.id} className="border border-[var(--color-border)] p-4 mb-4 rounded">
                    <Grid2 container>
                        <Grid2 size={12}>
                            <div className="mb-2">
                                <label className="block mb-1">Name:</label>
                                <input
                                    type="text"
                                    value={role.name}
                                    onChange={(e) => updateRole(role.id, 'name', e.target.value)}
                                    className="border border-[var(--color-border)] p-2 rounded w-full"
                                />
                            </div>
                        </Grid2>
                        <Grid2 size={12}>
                            <div className="mb-2">
                                <label className="block mb-1">Type:</label>
                                <select
                                    value={role.type}
                                    onChange={(e) => updateRole(role.id, 'type', e.target.value as RoleType)}
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
                        </Grid2>
                        <Grid2 size={12}>
                            <button
                                type="button"
                                onClick={() => removeRole(role.id)}
                                className="mt-2 bg-[var(--color-error)] text-[var(--color-background)] p-2 rounded"
                            >
                                Remove
                            </button>
                        </Grid2>
                    </Grid2>
                </Grid2>
            ))}
        </Grid2>
    );
};

export default RoleManager;
