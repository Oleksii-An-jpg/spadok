'use client';
import {Provider} from "@/components/ui/provider";
import { Toaster } from "@/components/ui/toaster"
import {defaultSystem} from "@chakra-ui/react";

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return <Provider system={defaultSystem}>
        {children}
        <Toaster />
    </Provider>;
}
