'use client';
import {Provider} from "@/components/ui/provider";
import {createSystem, defaultConfig} from "@chakra-ui/react";

const system = createSystem(defaultConfig, {
    preflight: false,      // <- disable Chakra's css reset
    // optionally: disable cascade layers if needed
    // disableLayers: true
});

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return <Provider system={system}>
        {children}
    </Provider>;
}
