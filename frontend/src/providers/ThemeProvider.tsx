import React from "react";
import {
    ThemeProvider as ChakraThemeProvider,
    CSSReset
} from "@chakra-ui/core";

function ThemeProvider({ children }: { children: React.ReactNode }) {
    return (
        <ChakraThemeProvider>
            <CSSReset />
            {children}
        </ChakraThemeProvider>
    );
}

export { ThemeProvider };
