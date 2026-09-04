'use client';
import {Provider} from "@/components/ui/provider";
import {Toaster} from "@/components/ui/toaster";
import {Container, defaultSystem} from "@chakra-ui/react";

export default function AuthLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return <Provider system={defaultSystem}>
        <Container maxW="2xl" py={10}>
            {children}
        </Container>
        <Toaster />
    </Provider>;
}
