import React from "react";

import { useAuthActions, useAuthState } from "../providers/AuthProvider";
import { Button, Heading, Stack, Box } from "@chakra-ui/core";
import { LambdaConfig } from "../../config/Lambda";
import { Uploader } from "../components/Uploader/Uploader";

function HomePage() {
    const { token } = useAuthState();
    const { login } = useAuthActions();

    if (token) return <Uploader />;

    return (
        <Box maxWidth={1080} textAlign="center" as="section">
            <Stack spacing={3}>
                <Heading as="h1">Login to continue</Heading>
                <Button onClick={login}>Login with Google</Button>
            </Stack>
        </Box>
    );
}

// function Upload() {
//     const { token } = useAuthState();
//
//     async function onClick() {
//         try {
//             const res = await fetch(
//                 `${LambdaConfig.signedURLLambdaEndpoint}?fileName=tata.jpg`,
//                 {
//                     method: "GET",
//                     headers: {
//                         Authorization: `Bearer ${token}`
//                     }
//                 }
//             );
//             console.log(res);
//         } catch (e) {
//             console.log(e);
//         }
//     }
//
//     return <Button onClick={onClick}>Click me to get the url</Button>;
// }

export { HomePage };
