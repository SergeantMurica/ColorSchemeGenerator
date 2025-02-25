import React, {useEffect, useState} from "react";
import styled from "styled-components";

interface Props {
    value: string;
    onChange: (value: string) => void;
}

const ColorInput: React.FC<Props> = ({value, onChange}) => {
    const [inputValue, setInputValue] = useState(value);

    // Update local input when prop changes
    useEffect(() => {
        setInputValue(value);
    }, [value]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setInputValue(newValue);

        // Validate hex code format
        if (/^#?([0-9A-F]{3}){1,2}$/i.test(newValue)) {
            // Ensure # prefix
            const formattedValue = newValue.startsWith('#') ? newValue : `#${newValue}`;
            onChange(formattedValue);
        }
    };

    const handleColorPickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setInputValue(newValue);
        onChange(newValue);
    };

    return (
        <Container>
            <InputRow>
                <ColorPreview style={{backgroundColor: value}}/>
                <HexInput
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    placeholder="#3E78B2"
                />
            </InputRow>
            <StyledColorPicker
                type="color"
                value={value}
                onChange={handleColorPickerChange}
            />
        </Container>
    );
};

const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
`;

const InputRow = styled.div`
    display: flex;
    align-items: center;
    gap: 0.5rem;
`;

const ColorPreview = styled.div`
    width: 32px;
    height: 32px;
    border-radius: 6px;
    border: 2px solid ${props => props.theme.surfaces.border};
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

const HexInput = styled.input`
    flex: 1;
    height: 40px;
    padding: 0 1rem;
    border-radius: 6px;
    border: 2px solid ${props => props.theme.surfaces.border};
    background: ${props => props.theme.surfaces.input};
    color: ${props => props.theme.text.primary};
    font-family: 'Roboto Mono', monospace;

    &:focus {
        outline: none;
        border-color: ${props => props.theme.accent};
    }
`;

const StyledColorPicker = styled.input`
    width: 100%;
    height: 40px;
    border: none;
    border-radius: 6px;
    cursor: pointer;

    &::-webkit-color-swatch-wrapper {
        padding: 0;
    }

    &::-webkit-color-swatch {
        border: none;
        border-radius: 6px;
    }
`;

export default ColorInput;
