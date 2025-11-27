'use client';
import {Provider} from "@/components/ui/provider";
import Header from "@/components/header";
import Footer from "@/components/footer";
import system from "@/theme";
import {Box} from "@chakra-ui/react";

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return <Provider system={system} forcedTheme="light">
        <Box className="bg-white">
            <Header />
            {children}
            <Footer />
        </Box>
    </Provider>;
}
