'use client';
import {Provider} from "@/components/ui/provider";
import {defaultSystem} from "@chakra-ui/react";

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return <Provider system={defaultSystem}>
        {children}
    </Provider>;
}
