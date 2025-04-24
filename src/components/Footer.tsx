import styled from "styled-components";

const Footer = () => {
    return (
        <FooterContainer>
            <FooterText>
                Chromatic Color Scheme Generator © {new Date().getFullYear()}
            </FooterText>
            <FooterLinks>
                <FooterLink href="#">About</FooterLink>
                <FooterLink href="#">Privacy</FooterLink>
                <FooterLink href="#">Terms</FooterLink>
            </FooterLinks>
        </FooterContainer>
    );
};

const FooterContainer = styled.footer`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 2rem 1.5rem;
    margin-top: 4rem;
    border-top: 1px solid ${props => props.theme.surfaces.border};
`;

const FooterText = styled.div`
    font-size: 0.875rem;
    color: ${props => props.theme.text.tertiary};
`;

const FooterLinks = styled.div`
    display: flex;
    gap: 1.5rem;
`;

const FooterLink = styled.a`
    font-size: 0.875rem;
    color: ${props => props.theme.text.secondary};
    text-decoration: none;
    transition: color 0.2s ease;

    &:hover {
        color: ${props => props.theme.text.primary};
    }
`;

export default Footer;
