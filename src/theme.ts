import {createSystem, defaultConfig, defineConfig} from "@chakra-ui/react";

const config = defineConfig({
    preflight: {
        scope: ".chakra-reset",
    },
    theme: {
        recipes: {
            button: {
                base: {
                    borderRadius: 0,
                    fontSize: 'xs',
                },
                variants: {
                    variant: {
                        'brand-primary': {
                            // bg-salmon hover:bg-azure text-black hover:text-travertine
                            background: "salmon.500",
                            color: "black",
                            _hover: {
                                background: "azure.500",
                                color: 'travertine.500',
                            },
                            _active: {
                                background: "azure.500",
                            },
                            _disabled: {
                                background: "gray.300",
                                color: "gray.500",
                                cursor: "not-allowed",
                            },
                        },
                        'brand-secondary': {
                            // bg-salmon hover:bg-azure text-black hover:text-travertine
                            background: "salmon.500",
                            color: "black",
                            _hover: {
                                background: "travertine.500",
                            },
                            _active: {
                                background: "travertine.500",
                            },
                            _disabled: {
                                background: "gray.300",
                                color: "gray.500",
                                cursor: "not-allowed",
                            },
                        },
                        'brand-tertiary': {
                            // bg-salmon hover:bg-azure text-black hover:text-travertine
                            background: "travertine.500",
                            color: "black",
                            _hover: {
                                background: "azure.500",
                                color: "travertine.500",
                            },
                            _active: {
                                background: "azure.500",
                                color: "travertine.500",
                            },
                            _disabled: {
                                background: "gray.300",
                                color: "gray.500",
                                cursor: "not-allowed",
                            },
                        }
                    }
                },
            },
        },
        tokens: {
            colors: {
                salmon: {
                    500: { value: "#FF7B7BFF" },
                },
                azure: {
                    500: { value: "#2F6DADFF" },
                },
                khaki: {
                    50: { value: "#FEFBF0" },
                    100: { value: "#FDF6D9" },
                    200: { value: "#FAEFC3" },
                    300: { value: "#F7E9AC" },
                    400: { value: "#F5E5A0" },
                    500: { value: "#F2E294" },
                    600: { value: "#EBCE5C" },
                    700: { value: "#D9B52F" },
                    800: { value: "#A88B24" },
                    900: { value: "#76621A" },
                    950: { value: "#4D4011" },
                },
                travertine: {
                    500: { value: "#FFFDEAFF" },
                },
                concrete: {
                    500: { value: "#F3F3F3FF"}
                }
            },
        }
    },
});

export default createSystem(defaultConfig, config)