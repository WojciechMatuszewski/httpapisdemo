import React from "react";
import { HomePage } from "./pages/Home";
import { Route, Switch } from "react-router-dom";
import { Spinner } from "@chakra-ui/core/dist";

function App() {
    return (
        <React.Suspense fallback={<Spinner />}>
            <Switch>
                <Route path="/" exact={true}>
                    <HomePage />
                </Route>
            </Switch>
        </React.Suspense>
    );
}

export { App };
