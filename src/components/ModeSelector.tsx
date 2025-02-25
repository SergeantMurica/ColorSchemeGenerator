import React from "react";
import styled from "styled-components";
import {ColorMode} from "../utils/colorUtils";

interface Props {
    selected: ColorMode;
    onChange: (mode: ColorMode) => void;
    isDarkMode: boolean;
}

interface ModeOption {
    value: ColorMode;
    label: string;
    description: string;
    darkOnly?: boolean;
    lightOnly?: boolean;
}

const options: ModeOption[] = [
    {
        value: "default",
        label: "Default",
        description: "Standard color palette",
        lightOnly: true
    },
    {
        value: "dark",
        label: "Dark",
        description: "Darker color palette",
        darkOnly: true
    },
    {
        value: "highContrast",
        label: "High Contrast",
        description: "Enhanced contrast for accessibility",
        lightOnly: true
    },
    {
        value: "highContrastDark",
        label: "High Contrast Dark",
        description: "Enhanced contrast in dark mode",
        darkOnly: true
    }
];

const ModeSelector: React.FC<Props> = ({selected, onChange, isDarkMode}) => {
    // Filter options based on current theme
    const filteredOptions = options.filter(option => {
        if (isDarkMode && option.lightOnly) return false;
        return !(!isDarkMode && option.darkOnly);

    });

    return (
        <Container>
            {filteredOptions.map(option => (
                <Option
                    key={option.value}
                    selected={selected === option.value}
                    onClick={() => onChange(option.value)}
                >
                    <OptionName>{option.label}</OptionName>
                    <OptionDescription>{option.description}</OptionDescription>
                </Option>
            ))}
        </Container>
    );
};

const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
`;

const Option = styled.div<{ selected: boolean }>`
    padding: 0.75rem 1rem;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
    background: ${props => props.selected
            ? props.theme.surfaces.selection
            : 'transparent'};

    &:hover {
        background: ${props => props.selected
                ? props.theme.surfaces.selection
                : props.theme.surfaces.hover};
    }
`;

const OptionName = styled.div`
    font-weight: 600;
    font-size: 0.875rem;
    margin-bottom: 0.25rem;
    color: ${props => props.theme.text.primary};
`;

const OptionDescription = styled.div`
    font-size: 0.75rem;
    color: ${props => props.theme.text.secondary};
`;

export default ModeSelector;
