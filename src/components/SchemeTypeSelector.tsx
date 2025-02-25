import React from "react";
import styled from "styled-components";
import {SchemeType} from "../utils/colorUtils";

interface Props {
    selected: SchemeType;
    onChange: (scheme: SchemeType) => void;
}

interface SchemeOption {
    value: SchemeType;
    label: string;
    description: string;
}

const options: SchemeOption[] = [
    {
        value: "monochromatic",
        label: "Monochromatic",
        description: "Different shades and tints of a single color"
    },
    {
        value: "analogous",
        label: "Analogous",
        description: "Colors that are adjacent on the color wheel"
    },
    {
        value: "complementary",
        label: "Complementary",
        description: "Colors opposite each other on the color wheel"
    },
    {
        value: "splitComplementary",
        label: "Split Complementary",
        description: "Base color plus two colors adjacent to its complement"
    },
    {
        value: "triadic",
        label: "Triadic",
        description: "Three colors evenly spaced around the color wheel"
    },
    {
        value: "tetradic",
        label: "Tetradic",
        description: "Two complementary color pairs"
    },
    {
        value: "square",
        label: "Square",
        description: "Four colors evenly spaced around the color wheel"
    }
];

const SchemeTypeSelector: React.FC<Props> = ({selected, onChange}) => {
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

export default SchemeTypeSelector;
