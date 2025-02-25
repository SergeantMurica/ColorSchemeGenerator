import React, {useState} from "react";
import {ThemeProvider} from "styled-components";
import ColorSchemeGenerator from "./components/ColorSchemeGenerator";
import {darkTheme, GlobalStyle, lightTheme} from "./styles/theme";
import Header from "./components/Header";
import Footer from "./components/Footer";

const App: React.FC = () => {
    const [isDarkMode, setIsDarkMode] = useState(false);

    return (
        <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
            <GlobalStyle/>
            <div className="app-container">
                <Header
                    isDarkMode={isDarkMode}
                    toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
                />
                <main>
                    <ColorSchemeGenerator isDarkMode={isDarkMode}/>
                </main>
                <Footer/>
            </div>
        </ThemeProvider>
    );
};

export default App;
