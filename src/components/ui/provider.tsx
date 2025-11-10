"use client"

import {ChakraProvider, SystemContext} from "@chakra-ui/react"
import {
    ColorModeProvider,
    type ColorModeProviderProps,
} from "./color-mode"

export function Provider({ system, ...rest }: ColorModeProviderProps & {
    system: SystemContext
}) {
    return (
        <ChakraProvider value={system}>
            <ColorModeProvider {...rest} />
        </ChakraProvider>
    )
}
