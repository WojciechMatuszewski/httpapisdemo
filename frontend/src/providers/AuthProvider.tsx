import React from "react";
import Auth from "@aws-amplify/auth";
import { Hub } from "@aws-amplify/core";
import { CognitoUserSession } from "amazon-cognito-identity-js";
import { AuthConfig } from "../../config/Auth";
import { CognitoHostedUIIdentityProvider } from "@aws-amplify/auth/lib-esm/types";
import { HubCapsule } from "@aws-amplify/core/lib-esm/Hub";
Auth.configure(AuthConfig);

type AuthState = {
    loading: boolean;
    error: boolean;
    token: string | undefined | null;
};

const AuthContext: React.Context<AuthState | undefined> = React.createContext(
    undefined as AuthState | undefined
);

function AuthProvider(props: { children: React.ReactNode }) {
    const [authState, setAuthState] = React.useState<AuthState>({
        loading: true,
        error: false,
        token: undefined
    });

    const tokenFromSession = React.useCallback(
        (session: CognitoUserSession | null) => {
            if (!session) return null;
            return session.getAccessToken().getJwtToken();
        },
        []
    );

    React.useEffect(() => {
        async function init() {
            try {
                const user = await Auth.currentAuthenticatedUser();
                const token = tokenFromSession(user.getSignInUserSession());
                console.log(
                    user.getSignInUserSession().getIdToken().getJwtToken()
                    // user.getUserData(console.log)

                    // user.authenticateUser(console.log)
                );
                if (!token) {
                    setAuthState({
                        loading: false,
                        error: false,
                        token: null
                    });
                }

                setAuthState({
                    loading: false,
                    error: false,
                    token: token
                });
            } catch (e) {
                setAuthState({
                    loading: false,
                    error: false,
                    token: null
                });
            }
        }

        init();
    }, []);

    React.useEffect(() => {
        function listener({ payload: { event, data } }: HubCapsule) {
            switch (event) {
                case "signIn":
                    setAuthState({
                        loading: false,
                        error: false,
                        token: tokenFromSession(data.getSignInUserSession())
                    });
                    break;
                case "signOut":
                    setAuthState({
                        loading: false,
                        error: false,
                        token: null
                    });
                    break;
            }
        }

        Hub.listen(/\.*/, console.log);

        Hub.listen("auth", listener);

        return () => Hub.remove("auth", listener);
    }, []);

    return (
        <AuthContext.Provider value={authState}>
            {props.children}
        </AuthContext.Provider>
    );
}

function useAuthState() {
    const state = React.useContext(AuthContext);
    if (!state) {
        throw new Error(
            "useAuthState can only be used within AuthStateProvider"
        );
    }

    return state;
}

function useAuthActions() {
    const login = React.useCallback(
        () =>
            Auth.federatedSignIn({
                provider: CognitoHostedUIIdentityProvider.Google
            }),
        []
    );
    const logout = React.useCallback(() => Auth.signOut({ global: true }), []);

    return { login, logout };
}

export { AuthProvider, useAuthActions, useAuthState };
