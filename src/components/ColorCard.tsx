import React, {useState} from "react";
import styled from "styled-components";
import {Color} from "../utils/colorUtils";

interface Props {
    color: Color;
    index: number;
}

const ColorCard: React.FC<Props> = ({color, index}) => {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(color.hex);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    return (
        <Card>
            <ColorSwatch style={{backgroundColor: color.hex}}>
                <CopyButton onClick={copyToClipboard}>
                    {copied ? "Copied!" : "Copy"}
                </CopyButton>
            </ColorSwatch>

            <ColorInfo>
                <ColorLabel>
                    {color.role ? <Role>{color.role}</Role> : `Color ${index + 1}`}
                </ColorLabel>
                <ColorValue>{color.hex}</ColorValue>
                <ColorName>{color.name}</ColorName>

                {color.role === 'text' && (
                    <AccessibilityInfo accessible={color.isAccessible}>
                        {color.isAccessible
                            ? `✓ Contrast: ${color.contrastRatio.toFixed(2)}:1`
                            : `⚠ Low contrast: ${color.contrastRatio.toFixed(2)}:1`}
                    </AccessibilityInfo>
                )}
            </ColorInfo>
        </Card>
    );
};

const Card = styled.div`
    background: ${props => props.theme.surfaces.card};
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    transition: transform 0.2s ease, box-shadow 0.2s ease;

    &:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12);
    }
`;

const ColorSwatch = styled.div`
    height: 120px;
    position: relative;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    padding-bottom: 1rem;
`;

const CopyButton = styled.button`
    background: rgba(255, 255, 255, 0.9);
    border: none;
    border-radius: 20px;
    padding: 0.4rem 0.8rem;
    font-size: 0.75rem;
    font-weight: 600;
    color: #333;
    cursor: pointer;
    opacity: 0;
    transform: translateY(10px);
    transition: opacity 0.2s ease, transform 0.2s ease;

    ${ColorSwatch}:hover & {
        opacity: 1;
        transform: translateY(0);
    }
`;

const ColorInfo = styled.div`
    padding: 1rem;
`;

const ColorLabel = styled.div`
    font-size: 0.875rem;
    font-weight: 600;
    margin-bottom: 0.25rem;
    color: ${props => props.theme.text.primary};
`;

const Role = styled.span`
    text-transform: capitalize;
`;

const ColorValue = styled.div`
    font-family: 'Roboto Mono', monospace;
    font-size: 0.875rem;
    color: ${props => props.theme.text.secondary};
    margin-bottom: 0.25rem;
`;

const ColorName = styled.div`
    font-size: 0.75rem;
    color: ${props => props.theme.text.tertiary};
`;

const AccessibilityInfo = styled.div<{ accessible: boolean }>`
    margin-top: 0.5rem;
    font-size: 0.75rem;
    font-weight: 500;
    color: ${props => props.accessible
            ? props.theme.success
            : props.theme.warning};
`;

export default ColorCard;
