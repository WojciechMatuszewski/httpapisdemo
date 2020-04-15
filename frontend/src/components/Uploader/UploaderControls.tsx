import React from "react";
import { Button, FormLabel, Icon, Alert } from "@chakra-ui/core";
import styled from "@emotion/styled";
import { AlertIcon, Box, Flex, Stack } from "@chakra-ui/core/dist";

const FileInput = styled.input`
    width: 0;
    height: 0;
`;

type ControlsStates = "IDLE" | "LOADING" | "ERROR";
type Props = {
    state: ControlsStates;
    prevState: ControlsStates;
    onRetry: VoidFunction;
    onReset: VoidFunction;
    onFileChange: React.ChangeEventHandler<HTMLInputElement>;
};

function UploaderControls({
    state,
    prevState,
    onReset,
    onRetry,
    onFileChange
}: Props) {
    if (state == "IDLE")
        return (
            <React.Fragment>
                <FormLabel htmlFor="file_upload" padding="0" width="100%">
                    <Button as="span" width="100%" variantColor="teal">
                        <Icon name="attachment" marginRight="8px" />
                        Attach
                    </Button>
                </FormLabel>
                <FileInput
                    onChange={onFileChange}
                    multiple={false}
                    accept="image/png,image/jpg,image/webp"
                    type="file"
                    id="file_upload"
                    name="file_upload"
                />
            </React.Fragment>
        );

    if (state == "LOADING" && prevState != "ERROR")
        return (
            <React.Fragment>
                <FormLabel htmlFor="file_upload" padding="0" width="100%">
                    <Button
                        as="span"
                        width="100%"
                        variantColor="teal"
                        isLoading={true}
                    >
                        <Icon name="attachment" marginRight="8px" />
                        Attach
                    </Button>
                </FormLabel>
                <FileInput
                    onChange={onFileChange}
                    multiple={false}
                    accept="image/png,image/jpg,image/webp"
                    type="file"
                    id="file_upload"
                    name="file_upload"
                />
            </React.Fragment>
        );

    if (state == "ERROR")
        return (
            <React.Fragment>
                <Stack spacing={3}>
                    <Alert status="error">
                        <AlertIcon />
                        Something went wrong
                    </Alert>
                    <Flex>
                        <Button
                            onClick={onRetry}
                            variantColor="teal"
                            marginRight={4}
                            flex={1}
                        >
                            Try again
                        </Button>
                        <Button
                            onClick={onReset}
                            variantColor="teal"
                            variant="outline"
                            flex={1}
                        >
                            Reset
                        </Button>
                    </Flex>
                </Stack>
            </React.Fragment>
        );

    if (state == "LOADING" && prevState == "ERROR")
        return (
            <React.Fragment>
                <Stack spacing={3}>
                    <Alert status="error">
                        <AlertIcon />
                        Something went wrong
                    </Alert>
                    <Flex>
                        <Button
                            onClick={onRetry}
                            isLoading={true}
                            variantColor="teal"
                            marginRight={4}
                            flex={1}
                        >
                            Try again
                        </Button>
                        <Button
                            onClick={onReset}
                            isDisabled={true}
                            variantColor="teal"
                            variant="outline"
                            flex={1}
                        >
                            Reset
                        </Button>
                    </Flex>
                </Stack>
            </React.Fragment>
        );
}

export { UploaderControls };
