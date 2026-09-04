import {createSystem, defaultConfig, defineConfig} from "@chakra-ui/react";
import {accordionAnatomy} from "@chakra-ui/react/anatomy";

const config = defineConfig({
    preflight: {
        scope: ".chakra-reset",
    },
    theme: {
        slotRecipes: {
            accordion: {
                slots: accordionAnatomy.keys(),
                base: {
                    itemTrigger: {
                        // Clicking a trigger left a focus box around "Категорії" /
                        // "Регіони" and around every name in the team block.
                        _focusVisible: {
                            outline: 'none',
                        },
                    },
                },
            },
        },
        recipes: {
            link: {
                variants: {
                    variant: {
                        // One rule for the whole site: text links carry an
                        // underline all the time, anything shaped like a button or
                        // a card never carries one, hover included.
                        underline: {
                            textDecoration: 'underline',
                            _hover: {
                                textDecoration: 'underline',
                            },
                        },
                        plain: {
                            textDecoration: 'none',
                            _hover: {
                                textDecoration: 'none',
                            },
                        },
                    },
                },
            },
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
                        },
                        'brand-quaternary': {
                            // bg-salmon hover:bg-azure text-black hover:text-travertine
                            background: "concrete.500",
                            color: "black",
                            _hover: {
                                background: "salmon.500",
                            },
                            _active: {
                                background: "salmon.500",
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
                    // Same value as --color-salmon in globals.css: Chakra used to
                    // carry an older pink, so buttons and arrows drifted away from
                    // everything Tailwind painted.
                    500: { value: "#FF7587" },
                },
                azure: {
                    500: { value: "#2F6DADFF" },
                },
                khaki: {
                    500: { value: "#F2E294FF" },
                },
                travertine: {
                    500: { value: "#FFFDEAFF" },
                },
                concrete: {
                    500: { value: "#F3F3F3FF"}
                }
            },
            fonts: {
                heading: { value: "var(--font-e-ukraine)" },
                body: { value: "var(--font-e-ukraine)" },
            }
        },
        semanticTokens: {
            colors: {
                salmon: {
                    solid: {value: "{colors.salmon.500}"},
                }
            }
        }
    },
});

export default createSystem(defaultConfig, config)