import React from 'react';
import {RoleResult} from '../utils/types.ts';
import {Grid2} from "@mui/material";

interface ColorSchemeDisplayProps {
    resultRoles: RoleResult[];
}

const ColorSchemeDisplay: React.FC<ColorSchemeDisplayProps> = ({resultRoles}) => {
    return (
        <Grid2 container spacing={2} className="mb-8">
            <Grid2 size={12}>
                <h2 className="text-2xl font-semibold mb-4">Generated Color Scheme:</h2>
            </Grid2>
            <Grid2 size={12}>
                <Grid2 container spacing={2}>
                    {resultRoles.map(({role, color}) => (
                        <Grid2 size={3}>
                            <div key={role.id}
                                 className="flex items-center p-2 border border-[var(--color-border)] rounded">
                                <div
                                    className="w-12 h-12 mr-4 rounded border"
                                    style={{backgroundColor: color, borderColor: color}}
                                ></div>
                                <div>
                                    <div className="font-semibold">{role.name}</div>
                                    <div className="text-sm">{color}</div>
                                </div>
                            </div>
                        </Grid2>
                    ))}
                </Grid2>
            </Grid2>
        </Grid2>
    );
};

export default ColorSchemeDisplay;
