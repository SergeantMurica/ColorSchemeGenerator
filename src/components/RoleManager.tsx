// src/components/RoleManager.tsx
import React, { useState } from "react";
import styled from "styled-components";

// Role definition that matches your existing type
export interface Role {
    id: number;
    name: string;
    type: RoleType;
}

export type RoleType =
    | "Background"
    | "Text"
    | "Border"
    | "Highlight"
    | "Accent"
    | "CTA"
    | "Link"
    | "Success"
    | "Warning"
    | "Error"
    | "Info"
    | "Disabled"
    | "Secondary"
    | "Overlay";

interface PresetGroup {
    name: string;
    type: RoleType;
}

// Presets for quick addition
interface PresetGroups {
    "Text Elements": PresetGroup[];
    "Background Layers": PresetGroup[];
    "UI Elements": PresetGroup[];
    "Interactive States": PresetGroup[];
}

const presetGroups: PresetGroups = {
    "Text Elements": [
        { name: "text-heading-1", type: "Text" },
        { name: "text-heading-2", type: "Text" },
        { name: "text-body", type: "Text" },
        { name: "text-caption", type: "Text" },
        { name: "text-link", type: "Link" },
        { name: "text-link-hover", type: "Link" },
        { name: "text-inactive", type: "Disabled" }
    ],
    "Background Layers": [
        { name: "background-primary", type: "Background" },
        { name: "background-secondary", type: "Secondary" },
        { name: "background-tertiary", type: "Background" }
    ],
    "UI Elements": [
        { name: "border", type: "Border" },
        { name: "shadow-light", type: "Background" },
        { name: "shadow-dark", type: "Background" },
        { name: "modal-overlay", type: "Overlay" },
        { name: "focus-ring", type: "Accent" }
    ],
    "Interactive States": [
        { name: "success", type: "Success" },
        { name: "warning", type: "Warning" },
        { name: "error", type: "Error" },
        { name: "info", type: "Info" },
        { name: "disabled", type: "Disabled" }
    ]
};

type PresetGroupKeys = keyof PresetGroups;


interface RoleManagerProps {
    roles: Role[];
    updateRole: (id: number, field: keyof Role, value: string | RoleType) => void;
    removeRole: (id: number) => void;
    addRole: (name?: string, type?: RoleType) => void;
    maxRoles?: number;
}

const RoleManager: React.FC<RoleManagerProps> = ({
                                                     roles,
                                                     updateRole,
                                                     removeRole,
                                                     addRole,
                                                     maxRoles = 20
                                                 }) => {
    const [newRoleName, setNewRoleName] = useState("");
    const [newRoleType, setNewRoleType] = useState<RoleType>("Background");
    const [showPresets, setShowPresets] = useState(false);
    const [activePresetCategory, setActivePresetCategory] = useState<PresetGroupKeys | null>(null);

    const handleAddRole = () => {
        if (!newRoleName.trim() || roles.length >= maxRoles) return;
        addRole(newRoleName, newRoleType);
        setNewRoleName("");
    };

    const handleAddPreset = (preset: { name: string; type: RoleType }) => {
        if (roles.length >= maxRoles) return;
        // Check if role with same name already exists
        if (!roles.some(role => role.name === preset.name)) {
            addRole(preset.name, preset.type);
        }
    };

    const handleAddPresetGroup = (presets: PresetGroup[]) => {
        // Add as many roles as possible up to the max
        const availableSlots = maxRoles - roles.length;
        const presetsToAdd = presets.slice(0, availableSlots);

        // Filter out any presets that already exist with the same name
        const newPresets = presetsToAdd.filter(
            preset => !roles.some(role => role.name === preset.name)
        );

        // Add each preset
        newPresets.forEach(preset => {
            addRole(preset.name, preset.type);
        });
    };

    return (
        <Container>
            <Header>
                <Title>Color Roles ({roles.length}/{maxRoles})</Title>
                <PresetsButton onClick={() => setShowPresets(!showPresets)}>
                    {showPresets ? "Hide Presets" : "Show Presets"}
                </PresetsButton>
            </Header>

            {/* Preset panels */}
            {showPresets && (
                <PresetsPanel>
                    <PresetCategoryTabs>
                        {Object.keys(presetGroups).map(category => (
                            <PresetCategoryTab
                                key={category}
                                active={activePresetCategory === category}
                                onClick={() => setActivePresetCategory(
                                    activePresetCategory === category ? null : (category as PresetGroupKeys)
                                )}
                            >
                                {category}
                            </PresetCategoryTab>
                        ))}
                    </PresetCategoryTabs>

                    {activePresetCategory && (
                        <PresetItems>
                            <PresetGroupActions>
                                <AddAllButton
                                    onClick={() => activePresetCategory && handleAddPresetGroup(presetGroups[activePresetCategory])}
                                    disabled={roles.length >= maxRoles}
                                >
                                    Add All {activePresetCategory}
                                </AddAllButton>
                            </PresetGroupActions>

                            {activePresetCategory && presetGroups[activePresetCategory].map((preset: { name: string; type: RoleType; }, index: React.Key | null | undefined) => (
                                <PresetItem key={index}>
                                    <PresetName>{preset.name}</PresetName>
                                    <PresetType>{preset.type}</PresetType>
                                    <AddPresetButton
                                        onClick={() => handleAddPreset(preset)}
                                        disabled={roles.length >= maxRoles}
                                    >
                                        Add
                                    </AddPresetButton>
                                </PresetItem>
                            ))}
                        </PresetItems>
                    )}
                </PresetsPanel>
            )}

            {/* Add new role form */}
            <AddRoleForm>
                <FormRow>
                    <InputGroup>
                        <Label>Role Name:</Label>
                        <Input
                            type="text"
                            value={newRoleName}
                            onChange={(e) => setNewRoleName(e.target.value)}
                            placeholder="Enter role name"
                        />
                    </InputGroup>

                    <InputGroup>
                        <Label>Role Type:</Label>
                        <Select
                            value={newRoleType}
                            onChange={(e) => setNewRoleType(e.target.value as RoleType)}
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
                        </Select>
                    </InputGroup>

                    <AddButton
                        onClick={handleAddRole}
                        disabled={!newRoleName.trim() || roles.length >= maxRoles}
                    >
                        Add Role
                    </AddButton>
                </FormRow>
            </AddRoleForm>

            {/* Display existing roles */}
            <RolesGrid>
                {roles.map((role) => (
                    <RoleCard key={role.id}>
                        <RoleCardHeader>
                            <RoleTypeTag type={role.type}>{role.type}</RoleTypeTag>
                            <RemoveButton onClick={() => removeRole(role.id)}>×</RemoveButton>
                        </RoleCardHeader>

                        <InputGroup>
                            <Label>Name:</Label>
                            <Input
                                type="text"
                                value={role.name}
                                onChange={(e) => updateRole(role.id, 'name', e.target.value)}
                            />
                        </InputGroup>

                        <InputGroup>
                            <Label>Type:</Label>
                            <Select
                                value={role.type}
                                onChange={(e) => updateRole(role.id, 'type', e.target.value as RoleType)}
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
                            </Select>
                        </InputGroup>
                    </RoleCard>
                ))}
            </RolesGrid>
        </Container>
    );
};

// Styled Components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h4`
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
  color: ${props => props.theme.text.primary};
`;

const PresetsButton = styled.button`
  background: ${props => props.theme.surfaces.button};
  border: none;
  border-radius: 6px;
  padding: 0.5rem 1rem;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  color: ${props => props.theme.text.secondary};
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.theme.surfaces.buttonHover};
    color: ${props => props.theme.text.primary};
  }
`;

const PresetsPanel = styled.div`
  background: ${props => props.theme.surfaces.card};
  border-radius: 8px;
  border: 1px solid ${props => props.theme.surfaces.border};
  overflow: hidden;
`;

const PresetCategoryTabs = styled.div`
  display: flex;
  border-bottom: 1px solid ${props => props.theme.surfaces.border};
  overflow-x: auto;
  padding: 0 0.5rem;
  
  &::-webkit-scrollbar {
    height: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: ${props => props.theme.surfaces.scrollbar};
    border-radius: 2px;
  }
`;

const PresetCategoryTab = styled.button<{ active: boolean }>`
  padding: 0.75rem 1rem;
  border: none;
  background: transparent;
  font-size: 0.9rem;
  font-weight: ${props => props.active ? 600 : 400};
  color: ${props => props.active ? props.theme.accent : props.theme.text.secondary};
  cursor: pointer;
  position: relative;
  white-space: nowrap;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0.5rem;
    right: 0.5rem;
    height: 2px;
    background: ${props => props.active ? props.theme.accent : 'transparent'};
    border-radius: 1px;
  }
  
  &:hover {
    color: ${props => props.active ? props.theme.accent : props.theme.text.primary};
  }
`;

const PresetItems = styled.div`
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-height: 300px;
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: ${props => props.theme.surfaces.scrollbar};
    border-radius: 3px;
  }
`;

const PresetGroupActions = styled.div`
  display: flex;
  justify-content: flex-end;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid ${props => props.theme.surfaces.border};
  margin-bottom: 0.5rem;
`;

const AddAllButton = styled.button<{ disabled?: boolean }>`
  background: ${props => props.theme.accent};
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.4rem 0.75rem;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.disabled ? 0.6 : 1};
  transition: all 0.2s ease;
  
  &:hover:not(:disabled) {
    opacity: 0.9;
  }
`;

const PresetItem = styled.div`
  display: flex;
  align-items: center;
  padding: 0.5rem;
  border-radius: 4px;
  background: ${props => props.theme.surfaces.input};
  
  &:hover {
    background: ${props => props.theme.surfaces.hover};
  }
`;

const PresetName = styled.div`
  flex: 1;
  font-size: 0.9rem;
  color: ${props => props.theme.text.primary};
`;

const PresetType = styled.div`
  font-size: 0.8rem;
  color: ${props => props.theme.text.secondary};
  background: ${props => props.theme.surfaces.card};
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  margin-right: 0.75rem;
`;

const AddPresetButton = styled.button<{ disabled?: boolean }>`
  background: ${props => props.theme.surfaces.button};
  border: none;
  border-radius: 4px;
  padding: 0.3rem 0.6rem;
  font-size: 0.8rem;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.disabled ? 0.6 : 1};
  
  &:hover:not(:disabled) {
    background: ${props => props.theme.surfaces.buttonHover};
  }
`;

const AddRoleForm = styled.div`
  background: ${props => props.theme.surfaces.card};
  border-radius: 8px;
  padding: 1rem;
  border: 1px solid ${props => props.theme.surfaces.border};
`;

const FormRow = styled.div`
  display: flex;
  gap: 1rem;
  align-items: flex-end;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex: 1;
`;

const Label = styled.label`
  font-size: 0.85rem;
  color: ${props => props.theme.text.secondary};
`;

const Input = styled.input`
  border: 1px solid ${props => props.theme.surfaces.border};
  border-radius: 4px;
  padding: 0.5rem 0.75rem;
  font-size: 0.9rem;
  background: ${props => props.theme.surfaces.input};
  color: ${props => props.theme.text.primary};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.accent};
  }
`;

const Select = styled.select`
  border: 1px solid ${props => props.theme.surfaces.border};
  border-radius: 4px;
  padding: 0.5rem 0.75rem;
  font-size: 0.9rem;
  background: ${props => props.theme.surfaces.input};
  color: ${props => props.theme.text.primary};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.accent};
  }
`;

const AddButton = styled.button<{ disabled?: boolean }>`
  background: ${props => props.theme.accent};
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  font-weight: 500;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.disabled ? 0.6 : 1};
  
  &:hover:not(:disabled) {
    opacity: 0.9;
  }
  
  @media (max-width: 768px) {
    align-self: flex-end;
  }
`;

const RolesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
`;

const RoleCard = styled.div`
  background: ${props => props.theme.surfaces.card};
  border-radius: 8px;
  padding: 1rem;
  border: 1px solid ${props => props.theme.surfaces.border};
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  transition: all 0.2s ease;
  
  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }
`;

const RoleCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const RoleTypeTag = styled.div<{ type: RoleType }>`
  font-size: 0.8rem;
  font-weight: 500;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  background: ${props => {
    switch (props.type) {
        case 'Background': return 'rgba(62, 120, 178, 0.15)';
        case 'Text': return 'rgba(54, 179, 126, 0.15)';
        case 'Border': return 'rgba(130, 130, 130, 0.15)';
        case 'Highlight': return 'rgba(255, 171, 0, 0.15)';
        case 'Accent': return 'rgba(144, 78, 149, 0.15)';
        case 'CTA': return 'rgba(235, 87, 87, 0.15)';
        case 'Link': return 'rgba(0, 122, 255, 0.15)';
        case 'Success': return 'rgba(54, 179, 126, 0.15)';
        case 'Warning': return 'rgba(255, 171, 0, 0.15)';
        case 'Error': return 'rgba(235, 87, 87, 0.15)';
        case 'Info': return 'rgba(0, 122, 255, 0.15)';
        case 'Disabled': return 'rgba(130, 130, 130, 0.15)';
        case 'Secondary': return 'rgba(130, 130, 130, 0.15)';
        case 'Overlay': return 'rgba(33, 43, 54, 0.15)';
        default: return 'rgba(130, 130, 130, 0.15)';
    }
}};
  color: ${props => {
    switch (props.type) {
        case 'Background': return 'rgb(52, 100, 148)';
        case 'Text': return 'rgb(44, 149, 106)';
        case 'Border': return 'rgb(90, 90, 90)';
        case 'Highlight': return 'rgb(195, 131, 0)';
        case 'Accent': return 'rgb(124, 58, 129)';
        case 'CTA': return 'rgb(195, 47, 47)';
        case 'Link': return 'rgb(0, 92, 195)';
        case 'Success': return 'rgb(44, 149, 106)';
        case 'Warning': return 'rgb(195, 131, 0)';
        case 'Error': return 'rgb(195, 47, 47)';
        case 'Info': return 'rgb(0, 92, 195)';
        case 'Disabled': return 'rgb(90, 90, 90)';
        case 'Secondary': return 'rgb(90, 90, 90)';
        case 'Overlay': return 'rgb(43, 53, 64)';
        default: return 'rgb(90, 90, 90)';
    }
}};
`;

const RemoveButton = styled.button`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: none;
  background: ${props => props.theme.surfaces.button};
  color: ${props => props.theme.text.secondary};
  font-size: 1.1rem;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  
  &:hover {
    background: ${props => props.theme.surfaces.buttonHover};
    color: ${props => props.theme.error};
  }
`;

export default RoleManager;
