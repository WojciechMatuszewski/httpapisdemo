import React from "react";
import { Box, Heading } from "@chakra-ui/core";
import { Stack } from "@chakra-ui/core/dist";
import { useAuthState } from "../../providers/AuthProvider";
import { LambdaConfig } from "../../../config/Lambda";
import { useMachine } from "@xstate/react";
import { getMachineState, UploaderMachine } from "./machine";
import { assign } from "xstate";
import { UploaderControls } from "./UploaderControls";

function Uploader() {
    const { token } = useAuthState();
    const [state, send] = useMachine(UploaderMachine, {
        context: { authorizationToken: token as string },
        actions: {
            pluckPresignedURL: assign({
                presignedURL: (context, event) => (event as any).data.url
            })
        },
        services: {
            uploadToS3: async (context, event) => {
                const response = await fetch(context.presignedURL as string, {
                    method: "PUT",
                    body: event.file
                });

                if (!response.ok) {
                    return Promise.reject();
                }

                return Promise.resolve();
            },
            getPresignedURL: async (context, event) => {
                const response = await fetch(
                    `${LambdaConfig.signedURLLambdaEndpoint}?fileName=${event.file.name}`,
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                if (!response.ok) {
                    return Promise.reject();
                }

                return await response.json();
            }
        }
    });

    const handleFileInputChange: React.ChangeEventHandler<HTMLInputElement> = (
        e
    ) => {
        const files = e.currentTarget.files;
        if (!files || files.length == 0) return;

        const file = Array.from(files)[0];

        send({ type: "START", file });
    };

    const currentState = getMachineState(state.value);
    const prevState = getMachineState(
        state.history ? state.history : undefined
    );

    if (currentState == "SUCCESS") return <div>works</div>;

    return (
        <Box
            padding={4}
            border="2px"
            borderStyle="dashed"
            borderColor="teal.300"
            maxW="sm"
            textAlign="center"
        >
            <Stack spacing={3} as="section">
                <Heading size="lg">Upload image</Heading>
                <Box>
                    <UploaderControls
                        state={currentState}
                        prevState={prevState}
                        onRetry={() => send({ type: "RETRY" })}
                        onReset={() => send({ type: "RESET" })}
                        onFileChange={handleFileInputChange}
                    />
                </Box>
            </Stack>
        </Box>
    );
}

export { Uploader };
