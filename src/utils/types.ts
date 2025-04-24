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
