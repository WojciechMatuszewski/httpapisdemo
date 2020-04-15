/// <reference types="react/experimental" />
/// <reference types="react-dom/experimental" />
import "core-js/stable";

import ReactDOM from "react-dom";
import React from "react";
import { App } from "./App";

import { Router } from "react-router-dom";
import { createBrowserHistory } from "history";
import { ThemeProvider } from "./providers/ThemeProvider";
import { AuthProvider } from "./providers/AuthProvider";

ReactDOM.createRoot(document.getElementById("root") as Element).render(
    <ThemeProvider>
        <AuthProvider>
            <Router history={createBrowserHistory()}>
                <App />
            </Router>
        </AuthProvider>
    </ThemeProvider>
);
