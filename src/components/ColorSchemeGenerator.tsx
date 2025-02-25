import React, {useEffect, useState} from "react";
import styled from "styled-components";
import {Color, ColorBlindnessType, ColorMode, generateColorScheme, SchemeType} from "../utils/colorUtils.ts";
import ColorCard from "./ColorCard";
import SchemeTypeSelector from "./SchemeTypeSelector";
import ModeSelector from "./ModeSelector";
import ColorBlindnessSimulator from "./ColorBlindnessSimulator";
import ColorInput from "./ColorInput";
import {breakpoints} from "../styles/theme.ts";
import ExportPanel from "./ExportPanel";

interface Props {
    isDarkMode: boolean;
}

const ColorSchemeGenerator: React.FC<Props> = ({isDarkMode}) => {
    const [baseColor, setBaseColor] = useState("#3E78B2");
    const [scheme, setScheme] = useState<SchemeType>("analogous");
    const [colorCount, setColorCount] = useState(5);
    const [colorMode, setColorMode] = useState<ColorMode>(
        isDarkMode ? "dark" : "default"
    );
    const [colorBlindness, setColorBlindness] = useState<ColorBlindnessType>("none");
    const [colors, setColors] = useState<Color[]>([]);
    const [showExport, setShowExport] = useState(false);

    // Regenerate colors when any relevant parameter changes
    useEffect(() => {
        const generatedColors = generateColorScheme(
            baseColor,
            scheme,
            colorCount,
            colorMode,
            colorBlindness
        );
        setColors(generatedColors);
    }, [baseColor, scheme, colorCount, colorMode, colorBlindness, isDarkMode]);

    // Update color mode when dark mode changes
    useEffect(() => {
        setColorMode(isDarkMode ?
            (colorMode.includes("highContrast") ? "highContrastDark" : "dark") :
            (colorMode.includes("highContrast") ? "highContrast" : "default")
        );
    }, [isDarkMode]);

    return (
        <Container>
            <ControlPanel>
                <Section>
                    <SectionTitle>Base Color</SectionTitle>
                    <ColorInput
                        value={baseColor}
                        onChange={setBaseColor}
                    />
                </Section>

                <Section>
                    <SectionTitle>Scheme Type</SectionTitle>
                    <SchemeTypeSelector
                        selected={scheme}
                        onChange={setScheme}
                    />
                </Section>

                <Section>
                    <SectionTitle>Number of Colors</SectionTitle>
                    <RangeInput
                        type="range"
                        min="3"
                        max="10"
                        value={colorCount}
                        onChange={(e) => setColorCount(parseInt(e.target.value))}
                    />
                    <RangeValue>{colorCount}</RangeValue>
                </Section>

                <Section>
                    <SectionTitle>Color Mode</SectionTitle>
                    <ModeSelector
                        selected={colorMode}
                        onChange={setColorMode}
                        isDarkMode={isDarkMode}
                    />
                </Section>

                <Section>
                    <SectionTitle>Accessibility</SectionTitle>
                    <ColorBlindnessSimulator
                        selected={colorBlindness}
                        onChange={setColorBlindness}
                    />
                </Section>

                <ButtonRow>
                    <Button onClick={() => setShowExport(true)}>
                        Export Colors
                    </Button>
                </ButtonRow>
            </ControlPanel>

            <PreviewSection>
                <SectionTitle>Generated Color Palette</SectionTitle>
                <ColorPalette>
                    {colors.map((color, index) => (
                        <ColorCard
                            key={index}
                            color={color}
                            index={index}
                        />
                    ))}
                </ColorPalette>

                <ApplicationPreview>
                    <SectionTitle>Preview</SectionTitle>
                    <PreviewContainer colors={colors}>
                        <PreviewHeader>
                            <PreviewLogo>ArtDeco</PreviewLogo>
                            <PreviewNav>
                                <PreviewNavItem>Home</PreviewNavItem>
                                <PreviewNavItem>Gallery</PreviewNavItem>
                                <PreviewNavItem>Contact</PreviewNavItem>
                            </PreviewNav>
                        </PreviewHeader>
                        <PreviewContent>
                            <PreviewHeading>Modern Design</PreviewHeading>
                            <PreviewText>
                                Experience the perfect balance of form and function with our
                                curated color palette.
                            </PreviewText>
                            <PreviewButton>Explore</PreviewButton>
                        </PreviewContent>
                    </PreviewContainer>
                </ApplicationPreview>
            </PreviewSection>

            {showExport && (
                <ExportPanel
                    colors={colors}
                    onClose={() => setShowExport(false)}
                />
            )}
        </Container>
    );
};

// Styled Components
const Container = styled.div`
    display: grid;
    grid-template-columns: 320px 1fr;
    gap: 2rem;
    max-width: 1200px;
    margin: 0 auto;
    padding: 1rem;

    @media ${breakpoints.tablet} {
        grid-template-columns: 1fr;
    }
`;

const ControlPanel = styled.div`
    background: ${props => props.theme.surfaces.card};
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    height: fit-content;
    position: sticky;
    top: 1rem;
`;

const Section = styled.div`
    margin-bottom: 1.5rem;
`;

const SectionTitle = styled.h3`
    font-family: 'Playfair Display', serif;
    font-size: 1.25rem;
    margin-bottom: 0.75rem;
    color: ${props => props.theme.text.primary};
    font-weight: 600;
`;

const RangeInput = styled.input`
    width: 100%;
    -webkit-appearance: none;
    height: 6px;
    border-radius: 3px;
    background: ${props => props.theme.surfaces.input};
    outline: none;
    margin-bottom: 0.5rem;

    &::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: ${props => props.theme.accent};
        cursor: pointer;
        transition: all 0.2s ease;

        &:hover {
            transform: scale(1.1);
        }
    }
`;

const RangeValue = styled.div`
    text-align: center;
    font-size: 1rem;
    font-weight: 500;
    color: ${props => props.theme.text.secondary};
`;

const ButtonRow = styled.div`
    display: flex;
    justify-content: center;
    margin-top: 2rem;
`;

const Button = styled.button`
    background: ${props => props.theme.accent};
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 30px;
    font-weight: 600;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
    }
`;

const PreviewSection = styled.div`
    display: flex;
    flex-direction: column;
    gap: 2rem;
`;

const ColorPalette = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 1rem;
    margin-bottom: 2rem;
`;

const ApplicationPreview = styled.div`
    background: ${props => props.theme.surfaces.card};
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
`;

const PreviewContainer = styled.div<{ colors: Color[] }>`
    background: ${props => props.colors[0]?.hex || props.theme.surfaces.background};
    border-radius: 8px;
    overflow: hidden;
    min-height: 300px;
`;

const PreviewHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
`;

const PreviewLogo = styled.div`
    font-family: 'Playfair Display', serif;
    font-size: 1.5rem;
    font-weight: 700;
    color: ${props => props.theme.text.primary};
`;

const PreviewNav = styled.div`
    display: flex;
    gap: 1.5rem;

    @media ${breakpoints.mobile} {
        display: none;
    }
`;

const PreviewNavItem = styled.div`
    cursor: pointer;
    position: relative;

    &:after {
        content: '';
        position: absolute;
        bottom: -5px;
        left: 0;
        width: 0;
        height: 2px;
        background: ${props => props.theme.accent};
        transition: width 0.2s ease;
    }

    &:hover:after {
        width: 100%;
    }
`;

const PreviewContent = styled.div`
    padding: 3rem 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
`;

const PreviewHeading = styled.h2`
    font-family: 'Playfair Display', serif;
    font-size: 2.5rem;
    margin-bottom: 1rem;

    @media ${breakpoints.mobile} {
        font-size: 2rem;
    }
`;

const PreviewText = styled.p`
    font-size: 1.1rem;
    line-height: 1.6;
    max-width: 600px;
    margin: 0 auto 2rem;

    @media ${breakpoints.mobile} {
        font-size: 1rem;
    }
`;

const PreviewButton = styled.button`
    background: ${props => props.theme.accent};
    color: white;
    border: none;
    padding: 0.75rem 2rem;
    border-radius: 30px;
    font-weight: 600;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
        transform: translateY(-2px);
    }
`;

export default ColorSchemeGenerator;
