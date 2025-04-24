import React from "react";
import styled from "styled-components";
import {breakpoints} from "../styles/theme";

interface Props {
    isDarkMode: boolean;
    toggleDarkMode: () => void;
}

const Header: React.FC<Props> = ({isDarkMode, toggleDarkMode}) => {
    return (
        <HeaderContainer>
            <Logo>Khroma</Logo>
            <Tagline>Professional Color Scheme Generator</Tagline>
            <Spacer/>
            <ThemeToggle onClick={toggleDarkMode}>
                {isDarkMode ? (
                    <i className="fas fa-sun"/>
                ) : (
                    <i className="fas fa-moon"/>
                )}
            </ThemeToggle>
        </HeaderContainer>
    );
};

const HeaderContainer = styled.header`
    display: flex;
    align-items: center;
    padding: 1.5rem;
    margin-bottom: 2rem;

    @media ${breakpoints.mobile} {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5rem;
    }
`;

const Logo = styled.h1`
    font-family: 'Playfair Display', serif;
    font-size: 2rem;
    font-weight: 700;
    margin: 0;
    background: linear-gradient(135deg, #3E78B2 0%, #904E95 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;

    @media ${breakpoints.mobile} {
        font-size: 1.75rem;
    }
`;

const Tagline = styled.div`
    margin-left: 1rem;
    font-size: 1rem;
    color: ${props => props.theme.text.secondary};

    @media ${breakpoints.mobile} {
        margin-left: 0;
        font-size: 0.875rem;
    }
`;

const Spacer = styled.div`
    flex: 1;
`;

const ThemeToggle = styled.button`
    background: none;
    border: none;
    cursor: pointer;
    font-size: 1.25rem;
    color: ${props => props.theme.text.secondary};
    transition: color 0.2s ease;

    &:hover {
        color: ${props => props.theme.text.primary};
    }
`;

export default Header;
