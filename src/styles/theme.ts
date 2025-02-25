import {createGlobalStyle} from "styled-components";

// Breakpoints for responsive design
export const breakpoints = {
    mobile: "(max-width: 480px)",
    tablet: "(max-width: 768px)",
    laptop: "(max-width: 1024px)"
};

// Light theme
export const lightTheme = {
    background: "#F8F9FC",
    text: {
        primary: "#212B36",
        secondary: "#637381",
        tertiary: "#919EAB",
        code: "#24292E"
    },
    accent: "#3E78B2",
    success: "#36B37E",
    warning: "#FFAB00",
    error: "#FF5630",
    surfaces: {
        card: "#FFFFFF",
        button: "#F4F6F8",
        buttonHover: "#DFE3E8",
        input: "#F9FAFB",
        border: "#E6E8EB",
        hover: "#F4F6F8",
        selection: "#EBF0F5",
        scrollbar: "#DFE3E8",
        code: "#F6F8FA"
    }
};

// Dark theme
export const darkTheme = {
    background: "#161C24",
    text: {
        primary: "#F1F3F5",
        secondary: "#B0B8C4",
        tertiary: "#637381",
        code: "#E6ECF1"
    },
    accent: "#4D89C4",
    success: "#36B37E",
    warning: "#FFAB00",
    error: "#FF5630",
    surfaces: {
        card: "#212B36",
        button: "#323F4B",
        buttonHover: "#455A64",
        input: "#2D3748",
        border: "#323F4B",
        hover: "#2D3748",
        selection: "#3E4C59",
        scrollbar: "#455A64",
        code: "#2D3748"
    }
};

// Global styles
export const GlobalStyle = createGlobalStyle`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@600;700&family=Roboto+Mono&display=swap');
    @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.0/css/all.min.css');

    * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
    }

    body {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        background-color: ${props => props.theme.background};
        color: ${props => props.theme.text.primary};
        transition: background-color 0.3s ease, color 0.3s ease;
        line-height: 1.5;
    }

    .app-container {
        padding: 1rem;
        max-width: 1400px;
        margin: 0 auto;
    }

    button, input, select {
        font-family: 'Inter', sans-serif;
    }

    h1, h2, h3, h4, h5, h6 {
        margin-bottom: 0.5rem;
    }

    main {
        min-height: calc(100vh - 200px);
    }

    /* Smooth transitions for theme changes */
    button, a, div, input, select, h1, h2, h3, h4, h5, h6, p, span {
        transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
    }
`;
