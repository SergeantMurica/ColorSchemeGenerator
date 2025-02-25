import React, {useState} from "react";
import styled from "styled-components";
import {Color} from "../utils/colorUtils";

interface Props {
    colors: Color[];
    onClose: () => void;
}

type ExportFormat = "css" | "scss" | "tailwind" | "json";

const ExportPanel: React.FC<Props> = ({colors, onClose}) => {
    const [format, setFormat] = useState<ExportFormat>("css");
    const [copied, setCopied] = useState(false);

    const getFormattedOutput = (): string => {
        switch (format) {
            case "css":
                return `:root {\n${colors
                    .map(color => `  --color-${color.role || `color-${colors.indexOf(color)}`}: ${color.hex};`)
                    .join("\n")}\n}`;

            case "scss":
                return `${colors
                    .map(color => `$${color.role || `color-${colors.indexOf(color)}`}: ${color.hex};`)
                    .join("\n")}`;

            case "tailwind":
                return `module.exports = {\n  theme: {\n    extend: {\n      colors: {\n${colors
                    .map(color => `        '${color.role || `color-${colors.indexOf(color)}`}': '${color.hex}',`)
                    .join("\n")}\n      }\n    }\n  }\n}`;

            case "json":
                return JSON.stringify(
                    colors.reduce((acc, color, index) => {
                        acc[color.role || `color-${index}`] = color.hex;
                        return acc;
                    }, {} as Record<string, string>),
                    null,
                    2
                );

            default:
                return "";
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(getFormattedOutput());
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Overlay onClick={onClose}>
            <Panel onClick={e => e.stopPropagation()}>
                <Header>
                    <Title>Export Colors</Title>
                    <CloseButton onClick={onClose}>&times;</CloseButton>
                </Header>

                <FormatSelector>
                    <FormatOption
                        selected={format === "css"}
                        onClick={() => setFormat("css")}
                    >
                        CSS Variables
                    </FormatOption>
                    <FormatOption
                        selected={format === "scss"}
                        onClick={() => setFormat("scss")}
                    >
                        SCSS Variables
                    </FormatOption>
                    <FormatOption
                        selected={format === "tailwind"}
                        onClick={() => setFormat("tailwind")}
                    >
                        Tailwind Config
                    </FormatOption>
                    <FormatOption
                        selected={format === "json"}
                        onClick={() => setFormat("json")}
                    >
                        JSON
                    </FormatOption>
                </FormatSelector>

                <CodeContainer>
                    <CodeBlock>{getFormattedOutput()}</CodeBlock>
                </CodeContainer>

                <CopyButton onClick={copyToClipboard}>
                    {copied ? "Copied!" : "Copy to Clipboard"}
                </CopyButton>
            </Panel>
        </Overlay>
    );
};

const Overlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
`;

const Panel = styled.div`
    background: ${props => props.theme.surfaces.card};
    border-radius: 12px;
    width: 90%;
    max-width: 600px;
    max-height: 80vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    box-shadow: 0 4px 25px rgba(0, 0, 0, 0.15);
`;

const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem;
    border-bottom: 1px solid ${props => props.theme.surfaces.border};
`;

const Title = styled.h2`
    margin: 0;
    font-size: 1.25rem;
    font-weight: 600;
    color: ${props => props.theme.text.primary};
`;

const CloseButton = styled.button`
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: ${props => props.theme.text.secondary};

    &:hover {
        color: ${props => props.theme.text.primary};
    }
`;

const FormatSelector = styled.div`
    display: flex;
    padding: 1rem 1.5rem;
    gap: 0.5rem;
    overflow-x: auto;
    border-bottom: 1px solid ${props => props.theme.surfaces.border};

    /* Scrollbar styling */
    scrollbar-width: thin;
    scrollbar-color: ${props => props.theme.surfaces.scrollbar} transparent;

    &::-webkit-scrollbar {
        height: 6px;
    }

    &::-webkit-scrollbar-track {
        background: transparent;
    }

    &::-webkit-scrollbar-thumb {
        background-color: ${props => props.theme.surfaces.scrollbar};
        border-radius: 3px;
    }
`;

const FormatOption = styled.button<{ selected: boolean }>`
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    white-space: nowrap;
    transition: all 0.2s ease;

    background: ${props => props.selected
            ? props.theme.accent
            : props.theme.surfaces.button};
    color: ${props => props.selected
            ? "white"
            : props.theme.text.secondary};
    border: none;

    &:hover {
        background: ${props => props.selected
                ? props.theme.accent
                : props.theme.surfaces.buttonHover};
    }
`;

const CodeContainer = styled.div`
    padding: 1.5rem;
    flex: 1;
    overflow-y: auto;

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

const CodeBlock = styled.pre`
    background: ${props => props.theme.surfaces.code};
    border-radius: 8px;
    padding: 1rem;
    margin: 0;
    font-family: 'Roboto Mono', monospace;
    font-size: 0.875rem;
    overflow-x: auto;
    color: ${props => props.theme.text.code};
    line-height: 1.5;
`;

const CopyButton = styled.button`
    margin: 0 1.5rem 1.5rem;
    padding: 0.75rem 1rem;
    border-radius: 8px;
    font-weight: 600;
    background: ${props => props.theme.accent};
    color: white;
    border: none;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
        opacity: 0.9;
        transform: translateY(-2px);
    }
`;

export default ExportPanel;
