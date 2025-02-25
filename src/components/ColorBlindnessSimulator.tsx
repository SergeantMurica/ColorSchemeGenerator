import React from "react";
import styled from "styled-components";
import {ColorBlindnessType} from "../utils/colorUtils";

interface Props {
    selected: ColorBlindnessType;
    onChange: (type: ColorBlindnessType) => void;
}

interface BlindnessOption {
    value: ColorBlindnessType;
    label: string;
    description: string;
}

const options: BlindnessOption[] = [
    {
        value: "none",
        label: "Normal Vision",
        description: "No color blindness simulation"
    },
    {
        value: "protanopia",
        label: "Protanopia",
        description: "Red-blind (difficulty distinguishing reds)"
    },
    {
        value: "deuteranopia",
        label: "Deuteranopia",
        description: "Green-blind (difficulty distinguishing greens)"
    },
    {
        value: "tritanopia",
        label: "Tritanopia",
        description: "Blue-blind (difficulty distinguishing blues)"
    },
    {
        value: "achromatopsia",
        label: "Achromatopsia",
        description: "Complete color blindness (grayscale vision)"
    }
];

const ColorBlindnessSimulator: React.FC<Props> = ({selected, onChange}) => {
    return (
        <Container>
            {options.map(option => (
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
    max-height: 200px;
    overflow-y: auto;
    padding-right: 0.5rem;

    /* Scrollbar styling */
    scrollbar-width: thin;
    scrollbar-color: ${props => props.theme.surfaces.scrollbar} transparent;

    &::-webkit-scrollbar {
        width: 6px;
    }

    &::-webkit-scrollbar-track {
        background: transparent;
    }

    &::-webkit-scrollbar-thumb {
        background-color: ${props => props.theme.surfaces.scrollbar};
        border-radius: 3px;
    }
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

export default ColorBlindnessSimulator;
