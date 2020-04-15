import { Machine, matchesState } from "xstate";

type MachineContext = {
    authorizationToken: string;
    presignedURL?: string;
};

type MachineEvent =
    | {
          type: "START";
          file: File;
      }
    | { type: "UPLOAD_TO_S3" }
    | { type: "RETRY" }
    | { type: "RESET" };

type MachineSchema = {
    states: {
        idle: {};
        gettingPresignedURL: {
            states: {
                loading: {};
                error: {};
            };
        };
        uploadingToS3: {
            states: {
                loading: {};
                error: {};
            };
        };
        success: {};
    };
};

const UploaderMachine = Machine<MachineContext, MachineSchema, MachineEvent>({
    id: "uploadMachine",
    initial: "idle",
    states: {
        idle: {
            id: "idle",
            on: {
                START: "gettingPresignedURL"
            }
        },
        gettingPresignedURL: {
            initial: "loading",
            id: "gettingPresignedURL",
            states: {
                loading: {
                    id: "loading",
                    invoke: {
                        id: "getPresignedURL",
                        src: "getPresignedURL",
                        onError: "error",
                        onDone: {
                            target: "#uploadingToS3",
                            actions: "pluckPresignedURL"
                        }
                    }
                },
                error: {
                    id: "error",
                    on: {
                        RESET: "#idle",
                        RETRY: "loading"
                    }
                }
            }
        },
        uploadingToS3: {
            id: "uploadingToS3",
            initial: "loading",
            states: {
                loading: {
                    id: "loading",
                    invoke: {
                        id: "uploadToS3",
                        src: "uploadToS3",
                        onError: "error",
                        onDone: "#success"
                    }
                },
                error: {
                    id: "error",
                    on: {
                        RETRY: "loading",
                        RESET: "#idle"
                    }
                }
            }
        },
        success: {
            id: "success"
        }
    }
});

const possibleMachineStates = {
    error: "ERROR",
    loading: "LOADING",
    idle: "IDLE",
    success: "SUCCESS"
} as const;

function getMachineState(machineState: any) {
    const ErrorStates = ["gettingPresignedURL.error", "uploadingToS3.error"];
    const LoadingStates = [
        "gettingPresignedURL.loading",
        "uploadingToS3.loading"
    ];

    // for prevState
    if (!machineState) return "IDLE";

    if (matchesState(machineState, "success"))
        return possibleMachineStates.success;

    if (matchesState(machineState, "idle")) return possibleMachineStates.idle;

    if (ErrorStates.some((path) => matchesState(machineState, path)))
        return possibleMachineStates.error;

    return possibleMachineStates.loading;
}

export { UploaderMachine, getMachineState };
