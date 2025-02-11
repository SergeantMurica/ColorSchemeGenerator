export type RoleType =
    | 'Background'
    | 'Text'
    | 'Border'
    | 'Highlight'
    | 'Accent'
    | 'CTA'
    | 'Link'
    | 'Success'
    | 'Warning'
    | 'Error'
    | 'Info'
    | 'Disabled'
    | 'Secondary'
    | 'Overlay';

export interface Role {
    id: number;
    name: string;
    type: RoleType;
}

export interface RoleResult {
    role: Role;
    color: string;
}

export interface VariantSet {
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