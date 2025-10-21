"use client"

import { ChakraProvider, defaultConfig, createSystem } from "@chakra-ui/react"
import {
  ColorModeProvider,
  type ColorModeProviderProps,
} from "./color-mode"

const system = createSystem(defaultConfig, {
    preflight: false,      // <- disable Chakra's css reset
    // optionally: disable cascade layers if needed
    // disableLayers: true
});

export function Provider(props: ColorModeProviderProps) {
  return (
    <ChakraProvider value={system}>
      <ColorModeProvider {...props} />
    </ChakraProvider>
  )
}
